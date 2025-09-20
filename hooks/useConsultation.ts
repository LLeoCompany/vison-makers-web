/**
 * 상담 관련 React Hook
 * 상담 폼 상태 관리 및 API 호출 로직
 */

import { useState, useEffect, useCallback } from 'react';
// import { ConsultationRequest, ContactInfo } from '@/types/database';
import { ContactInfo } from '@/types/consultation';
// import {
//   submitConsultation,
//   getConsultationStatus,
//   validateConsultationForm,
//   localStorage,
// } from '@/services/consultation';

// 상담 폼 상태 타입
export interface ConsultationFormState {
  // 상담 타입
  type: 'guided' | 'free' | null;

  // 연락처 정보
  contact: ContactInfo;

  // 가이드 상담 전용 필드
  serviceType?: 'web_development' | 'mobile_app' | 'desktop_app' | 'ai_ml' | 'blockchain' | 'iot' | 'consulting' | 'maintenance' | 'other';
  projectSize?: 'small' | 'medium' | 'large';
  budget?: 'under_1000' | '1000_to_3000' | '3000_to_5000' | '5000_to_10000' | 'over_10000' | 'negotiable';
  timeline?: 'asap' | '1_month' | '1_3_months' | '3_6_months' | '6_12_months' | 'over_1_year' | 'flexible';
  importantFeatures?: ('mobile' | 'seo' | 'admin' | 'payment')[];
  additionalRequests?: string;

  // 자유 상담 전용 필드
  projectDescription?: string;
  budgetRange?: string;
  timelinePreference?: string;
}

// 초기 상태
const initialFormState: ConsultationFormState = {
  type: null,
  contact: {
    name: '',
    email: '',
    phone: '',
    company: '',
    preferredContactTime: 'anytime',
  },
  importantFeatures: [],
  additionalRequests: '',
  projectDescription: '',
  budgetRange: '',
  timelinePreference: '',
};

export function useConsultation() {
  const [formData, setFormData] = useState<ConsultationFormState>(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<{
    consultationId: string;
    consultationNumber: string;
    estimatedContactTime: string;
  } | null>(null);

  // 로컬 스토리지에서 진행 상태 복원
  useEffect(() => {
    const savedProgress = localStorage.getConsultationProgress();
    if (savedProgress) {
      setFormData(prevData => ({ ...prevData, ...savedProgress.data }));
      setCurrentStep(savedProgress.step);
    }
  }, []);

  // 폼 데이터 업데이트
  const updateFormData = useCallback((updates: Partial<ConsultationFormState>) => {
    setFormData(prevData => {
      const newData = { ...prevData, ...updates };

      // 로컬 스토리지에 저장
      localStorage.saveConsultationProgress(currentStep, newData);

      return newData;
    });
  }, [currentStep]);

  // 단일 필드 업데이트
  const updateField = useCallback((field: keyof ConsultationFormState, value: any) => {
    updateFormData({ [field]: value });
  }, [updateFormData]);

  // 연락처 정보 업데이트
  const updateContact = useCallback((contactUpdates: Partial<ContactInfo>) => {
    setFormData(prevData => {
      const newData = {
        ...prevData,
        contact: { ...prevData.contact, ...contactUpdates }
      };

      localStorage.saveConsultationProgress(currentStep, newData);
      return newData;
    });
  }, [currentStep]);

  // 중요 기능 토글
  const toggleImportantFeature = useCallback((feature: 'mobile' | 'seo' | 'admin' | 'payment') => {
    setFormData(prevData => {
      const currentFeatures = prevData.importantFeatures || [];
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter(f => f !== feature)
        : [...currentFeatures, feature];

      const newData = { ...prevData, importantFeatures: newFeatures };
      localStorage.saveConsultationProgress(currentStep, newData);
      return newData;
    });
  }, [currentStep]);

  // 스텝 이동
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    localStorage.saveConsultationProgress(step, formData);
  }, [formData]);

  const nextStep = useCallback(() => {
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    localStorage.saveConsultationProgress(newStep, formData);
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    const newStep = Math.max(1, currentStep - 1);
    setCurrentStep(newStep);
    localStorage.saveConsultationProgress(newStep, formData);
  }, [currentStep, formData]);

  // 폼 유효성 검증
  const validateForm = useCallback(() => {
    // return validateConsultationForm(formData as any);
    return { isValid: true, errors: [] };
  }, [formData]);

  // 현재 스텝 유효성 검증
  const validateCurrentStep = useCallback(() => {
    const errors: { [key: string]: string } = {};

    if (formData.type === 'guided') {
      switch (currentStep) {
        case 1:
          if (!formData.serviceType) errors.serviceType = '서비스 종류를 선택해주세요.';
          break;
        case 2:
          if (!formData.projectSize) errors.projectSize = '프로젝트 규모를 선택해주세요.';
          if (!formData.budget) errors.budget = '예산 범위를 선택해주세요.';
          break;
        case 3:
          if (!formData.timeline) errors.timeline = '완성 희망 시기를 선택해주세요.';
          break;
        case 4:
          if (!formData.contact.name) errors.name = '이름을 입력해주세요.';
          if (!formData.contact.phone) errors.phone = '연락처를 입력해주세요.';
          if (!formData.contact.email) errors.email = '이메일을 입력해주세요.';
          break;
      }
    } else if (formData.type === 'free') {
      switch (currentStep) {
        case 1:
          if (!formData.projectDescription || formData.projectDescription.length < 20) {
            errors.projectDescription = '프로젝트 설명은 최소 20자 이상 작성해주세요.';
          }
          break;
        case 2:
          if (!formData.contact.name) errors.name = '이름을 입력해주세요.';
          if (!formData.contact.phone) errors.phone = '연락처를 입력해주세요.';
          if (!formData.contact.email) errors.email = '이메일을 입력해주세요.';
          break;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [formData, currentStep]);

  // 상담 신청 제출
  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 최종 유효성 검증
      const validation = validateForm();
      if (!validation.isValid) {
        throw new Error('입력 정보를 확인해주세요.');
      }

      // API 요청용 데이터 변환
      const submissionData: any = formData.type === 'guided' ? {
        type: 'guided',
        serviceType: formData.serviceType!,
        projectSize: formData.projectSize!,
        budget: formData.budget!,
        timeline: formData.timeline!,
        importantFeatures: formData.importantFeatures || [],
        additionalRequests: formData.additionalRequests || '',
        contact: formData.contact,
      } : {
        type: 'free',
        projectDescription: formData.projectDescription!,
        budget: formData.budgetRange || '',
        timeline: formData.timelinePreference || '',
        contact: formData.contact,
      };

      // const result = await submitConsultation(submissionData);
      const result = {
        success: true,
        data: {
          consultationNumber: 'test-123',
          consultationId: 'test-123',
          estimatedContactTime: '24시간 이내'
        }
      };

      // 성공 시 상태 업데이트
      setSubmitSuccess({
        consultationId: result.data.consultationId,
        consultationNumber: result.data.consultationNumber,
        estimatedContactTime: result.data.estimatedContactTime,
      });

      // 로컬 스토리지에 완료된 상담 번호 저장
      localStorage.saveConsultationNumber(result.data.consultationNumber);

      // 진행 상태 삭제
      localStorage.clearConsultationProgress();

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '상담 신청 중 오류가 발생했습니다.';
      setSubmitError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  // 폼 리셋
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setSubmitError(null);
    setSubmitSuccess(null);
    localStorage.clearConsultationProgress();
  }, []);

  // 진행률 계산
  const getProgress = useCallback(() => {
    if (!formData.type) return 0;

    if (formData.type === 'guided') {
      return Math.round((currentStep / 4) * 100);
    } else {
      return Math.round((currentStep / 2) * 100);
    }
  }, [formData.type, currentStep]);

  // 최대 스텝 수 계산
  const getMaxSteps = useCallback(() => {
    if (!formData.type) return 1;
    return formData.type === 'guided' ? 4 : 2;
  }, [formData.type]);

  return {
    // 상태
    formData,
    currentStep,
    isSubmitting,
    submitError,
    submitSuccess,

    // 액션
    updateFormData,
    updateField,
    updateContact,
    toggleImportantFeature,
    goToStep,
    nextStep,
    prevStep,
    submitForm,
    resetForm,

    // 유틸리티
    validateForm,
    validateCurrentStep,
    getProgress,
    getMaxSteps,
  };
}

/**
 * 상담 상태 조회 Hook
 */
export function useConsultationStatus(consultationNumber: string | null) {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!consultationNumber) return;

    setIsLoading(true);
    setError(null);

    try {
      // const result = await getConsultationStatus(consultationNumber);
      const result = { success: true, data: { status: 'pending' } };
      setStatus(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '상태 조회 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [consultationNumber]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}