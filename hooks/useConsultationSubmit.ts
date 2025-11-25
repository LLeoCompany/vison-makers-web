/**
 * 상담 신청 제출 훅
 * API 연결, 에러 처리, 재시도 로직, 실시간 최적화 포함
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { ConsultationRequest, ConsultationResponse } from '@/types/consultation';
import { withRetry } from '@/utils/retry';
import { handleApiError } from '@/utils/errorHandler';

interface UseConsultationSubmitReturn {
  submitConsultation: (data: ConsultationRequest) => Promise<ConsultationResponse | null>;
  isSubmitting: boolean;
  error: string | null;
  clearError: () => void;
  retryLastSubmission: () => Promise<ConsultationResponse | null>;
}

export const useConsultationSubmit = (): UseConsultationSubmitReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmissionData, setLastSubmissionData] = useState<ConsultationRequest | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  const submitConsultation = async (
    data: ConsultationRequest
  ): Promise<ConsultationResponse | null> => {
    setIsSubmitting(true);
    setError(null);
    setLastSubmissionData(data);

    try {
      // 중복 제출 방지 체크
      const lastSubmissionTime = localStorage.getItem('last_submission_time');
      const now = Date.now();
      if (lastSubmissionTime && now - parseInt(lastSubmissionTime) < 5000) {
        throw new Error('너무 빠른 연속 요청입니다. 잠시 후 다시 시도해주세요.');
      }

      // API 요청 (재시도 로직 포함)
      const response = await withRetry(
        () => makeApiRequest(data),
        {
          maxRetries: 3,
          baseDelay: 1000,
          retryCondition: (error) => {
            // 4xx 클라이언트 에러는 재시도하지 않음
            return !error.response || error.response.status >= 500;
          }
        }
      );

      // 성공 시 마지막 제출 시간 저장
      localStorage.setItem('last_submission_time', now.toString());

      // 성공 이벤트 추적
      gtag('event', 'consultation_submitted', {
        event_category: 'Conversion',
        event_label: data.type,
        value: 1,
        consultation_type: data.type,
        service_type: data.type === 'guided' ? data.serviceType : 'free'
      });

      // 전환 이벤트 (Google Ads)
      gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
        value: 1.0,
        currency: 'KRW'
      });

      // Facebook Pixel 전환 이벤트
      if (typeof (window as any).fbq !== 'undefined') {
        (window as any).fbq('track', 'Lead', {
          content_category: 'consultation',
          content_name: data.type,
          value: 1,
          currency: 'KRV'
        });
      }

      // 성공 시 알럿 표시 후 메인 페이지로 이동
      alert(`상담 신청이 완료되었습니다!\n\n상담 번호: ${response.data.consultationNumber}\n영업일 기준 24시간 이내에 연락드리겠습니다.`);
      router.push("/");

      return response;

    } catch (err) {
      const appError = handleApiError(err);
      setError(appError.message);

      // 에러 이벤트 추적
      gtag('event', 'consultation_error', {
        event_category: 'Error',
        event_label: appError.code,
        error_message: appError.message,
        consultation_type: data.type
      });

      console.error('Consultation submission failed:', appError);
      return null;

    } finally {
      setIsSubmitting(false);
    }
  };

  const retryLastSubmission = async (): Promise<ConsultationResponse | null> => {
    if (!lastSubmissionData) {
      setError('재시도할 데이터가 없습니다.');
      return null;
    }

    return submitConsultation(lastSubmissionData);
  };

  return {
    submitConsultation,
    isSubmitting,
    error,
    clearError,
    retryLastSubmission
  };
};

// API 요청 함수
const makeApiRequest = async (data: ConsultationRequest): Promise<ConsultationResponse> => {
  const startTime = performance.now();

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: data.type,
        contact: data.contact,
        serviceType: data.serviceType,
        projectSize: data.projectSize,
        budget: data.budget,
        timeline: data.timeline,
        importantFeatures: data.importantFeatures,
        additionalRequests: data.additionalRequests,
        projectDescription: data.projectDescription,
      })
    });

    const responseTime = performance.now() - startTime;

    // API 응답 시간 추적
    gtag('event', 'api_response_time', {
      event_category: 'Performance',
      api_endpoint: 'consultation-submit',
      response_time: Math.round(responseTime),
      status: response.ok ? 'success' : 'error'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        response: {
          status: response.status,
          data: errorData
        },
        message: errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();

    // 응답 검증
    if (!result.success) {
      throw new Error(result.message || '서버에서 오류가 발생했습니다.');
    }

    return result;

  } catch (error) {
    const responseTime = performance.now() - startTime;

    // API 에러 응답 시간 추적
    gtag('event', 'api_response_time', {
      event_category: 'Performance',
      api_endpoint: 'consultation-submit',
      response_time: Math.round(responseTime),
      status: 'error'
    });

    throw error;
  }
};

// 고유 요청 ID 생성
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 간단한 이메일 상담 신청 (Exit Intent용)
export const useQuickEmailSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuickEmail = async (email: string): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/consultation-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': 'v2'
        },
        body: JSON.stringify({
          type: 'free',
          projectDescription: '이메일을 통한 견적서 요청 (Exit Intent)',
          contact: {
            name: '견적서 요청',
            email: email,
            phone: '추후 제공',
            preferredContactTime: 'anytime'
          },
          metadata: {
            source: 'exit_intent',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      });

      if (!response.ok) {
        throw new Error('견적서 요청 중 오류가 발생했습니다.');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '서버 오류가 발생했습니다.');
      }

      // 성공 이벤트 추적
      gtag('event', 'quick_email_submitted', {
        event_category: 'Conversion',
        event_label: 'exit_intent',
        value: 1
      });

      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);

      gtag('event', 'quick_email_error', {
        event_category: 'Error',
        event_label: 'exit_intent',
        error_message: errorMessage
      });

      return false;

    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuickEmail,
    isSubmitting,
    error
  };
};

export default useConsultationSubmit;