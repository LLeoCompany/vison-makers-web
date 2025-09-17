/**
 * VisionMakers 상담 시스템 - 가이드 트랙 4단계: 연락처
 * 설계 문서 3.5 가이드 트랙 - Step 4 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import { useConsultation } from '@/contexts/ConsultationContext';
import {
  ContactInfo,
  CONTACT_TIME_DESCRIPTIONS
} from '@/types/consultation';

const contactTimeOptions = [
  {
    value: 'morning',
    label: CONTACT_TIME_DESCRIPTIONS.morning,
    description: '오전 시간대 연락 선호'
  },
  {
    value: 'afternoon',
    label: CONTACT_TIME_DESCRIPTIONS.afternoon,
    description: '가장 빠른 응답 가능',
    recommended: true
  },
  {
    value: 'evening',
    label: CONTACT_TIME_DESCRIPTIONS.evening,
    description: '저녁 시간대 연락 선호'
  },
  {
    value: 'anytime',
    label: CONTACT_TIME_DESCRIPTIONS.anytime,
    description: '시간 상관없이 연락 가능'
  }
];

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  preferredContactTime?: string;
  privacyConsent?: string;
}

export default function GuidedStep4() {
  const router = useRouter();
  const { state, setContact, prevStep } = useConsultation();
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const contact = state.guided.contact;

    if (!contact.name?.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!contact.phone?.trim()) {
      newErrors.phone = '연락처를 입력해주세요.';
    } else if (!/^[0-9-+\s]+$/.test(contact.phone)) {
      newErrors.phone = '올바른 연락처 형식이 아닙니다.';
    }

    if (!contact.email?.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!contact.preferredContactTime) {
      newErrors.preferredContactTime = '연락 희망 시간을 선택해주세요.';
    }

    if (!privacyConsent) {
      newErrors.privacyConsent = '개인정보 수집 동의가 필요합니다.';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 상담 데이터 준비
      const consultationData = {
        type: 'guided' as const,
        serviceType: state.guided.serviceType!,
        projectSize: state.guided.projectSize!,
        budget: state.guided.budget!,
        timeline: state.guided.timeline!,
        importantFeatures: state.guided.importantFeatures,
        additionalRequests: state.guided.additionalRequests,
        contact: state.guided.contact as ContactInfo
      };

      // API 호출
      const response = await fetch('/api/consultation-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData)
      });

      if (!response.ok) {
        throw new Error('상담 신청 중 오류가 발생했습니다.');
      }

      const result = await response.json();

      // 성공 시 완료 페이지로 이동
      router.push(`/consultation/thanks?id=${result.consultationId}`);

    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        name: error instanceof Error ? error.message : '상담 신청 중 오류가 발생했습니다.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    prevStep();
    router.push('/consultation/guided/step3');
  };

  const handleInputChange = (field: keyof ContactInfo, value: string) => {
    setContact({ [field]: value }, 'guided');
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleContactTimeChange = (value: string) => {
    setContact({ preferredContactTime: value as ContactInfo['preferredContactTime'] }, 'guided');
    setErrors(prev => ({ ...prev, preferredContactTime: undefined }));
  };

  return (
    <ConsultationLayout
      title="연락처 입력"
      showProgress={true}
    >
      <div className="container">
        <div className="card">
          {/* 헤더 */}
          <div className="text-center m-xl">
            <h1 className="text-h2 text-primary">
              🎯 4/4단계 - 연락처만 알려주세요!
            </h1>
            <p className="text-body text-secondary m-md">
              마지막 단계입니다. 연락처를 확인한 후 빠르게 연락드리겠습니다.
            </p>
          </div>

          {/* 기본 정보 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              👤 기본 정보
            </h2>
            <div className="grid gap-lg">
              <div>
                <label className="text-body text-primary m-sm block">
                  이름 <span className="text-red">*</span>
                </label>
                <div className="card-simple">
                  <input
                    type="text"
                    value={state.guided.contact.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="홍길동"
                    className={`w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none ${
                      errors.name ? 'placeholder-red' : ''
                    }`}
                    style={{ fontFamily: 'var(--font-family)' }}
                  />
                </div>
                {errors.name && (
                  <p className="text-red text-body-sm m-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-body text-primary m-sm block">
                  연락처 <span className="text-red">*</span>
                </label>
                <div className="card-simple">
                  <input
                    type="tel"
                    value={state.guided.contact.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="010-1234-5678"
                    className={`w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none ${
                      errors.phone ? 'placeholder-red' : ''
                    }`}
                    style={{ fontFamily: 'var(--font-family)' }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red text-body-sm m-sm">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="text-body text-primary m-sm block">
                  이메일 <span className="text-red">*</span>
                </label>
                <div className="card-simple">
                  <input
                    type="email"
                    value={state.guided.contact.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="hong@example.com"
                    className={`w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none ${
                      errors.email ? 'placeholder-red' : ''
                    }`}
                    style={{ fontFamily: 'var(--font-family)' }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red text-body-sm m-sm">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* 회사 정보 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              🏢 회사 정보 <span className="text-body-sm text-secondary">(선택사항)</span>
            </h2>
            <div>
              <label className="text-body text-primary m-sm block">
                회사명
              </label>
              <div className="card-simple">
                <input
                  type="text"
                  value={state.guided.contact.company || ''}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="회사명 또는 사업자명"
                  className="w-full p-0 border-0 text-body text-primary bg-transparent focus:outline-none"
                  style={{ fontFamily: 'var(--font-family)' }}
                />
              </div>
            </div>
          </div>

          {/* 연락 희망 시간 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              📞 언제 연락드릴까요?
            </h2>
            <div className="grid gap-md">
              {contactTimeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`card-simple cursor-pointer transition-all duration-200 ${
                    state.guided.contact.preferredContactTime === option.value
                      ? 'border-red bg-red/5'
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleContactTimeChange(option.value)}
                >
                  <div className="flex items-start gap-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-sm m-xs">
                        <h3 className="text-h3 text-primary">
                          {option.label}
                        </h3>
                        {option.recommended && (
                          <span className="bg-red text-white px-md py-sm text-body-sm rounded-full">
                            추천
                          </span>
                        )}
                      </div>
                      <p className="text-body text-secondary">
                        {option.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        state.guided.contact.preferredContactTime === option.value
                          ? 'border-red bg-red'
                          : 'border-gray-300'
                      }`}>
                        {state.guided.contact.preferredContactTime === option.value && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.preferredContactTime && (
              <div className="text-red text-body-sm m-md">
                {errors.preferredContactTime}
              </div>
            )}
          </div>

          {/* 개인정보 동의 */}
          <div className="m-xl">
            <div className="card-simple">
              <div className="flex items-start gap-md">
                <div
                  className={`w-6 h-6 border-2 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    privacyConsent
                      ? 'border-red bg-red'
                      : 'border-gray-300'
                  }`}
                  onClick={() => {
                    setPrivacyConsent(!privacyConsent);
                    setErrors(prev => ({ ...prev, privacyConsent: undefined }));
                  }}
                >
                  {privacyConsent && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    className="text-body text-primary cursor-pointer"
                    onClick={() => {
                      setPrivacyConsent(!privacyConsent);
                      setErrors(prev => ({ ...prev, privacyConsent: undefined }));
                    }}
                  >
                    ✅ 개인정보 수집 동의 <span className="text-red">*</span>
                  </label>
                  <p className="text-body-sm text-secondary m-xs">
                    상담을 위한 개인정보 수집에 동의합니다.<br />
                    수집항목: 이름, 연락처, 이메일 | 보관기간: 1년
                  </p>
                  <button
                    type="button"
                    className="text-body-sm text-red hover:underline m-xs"
                    onClick={() => window.open('/privacy-policy', '_blank')}
                  >
                    개인정보처리방침 자세히보기
                  </button>
                </div>
              </div>
            </div>
            {errors.privacyConsent && (
              <p className="text-red text-body-sm m-md">{errors.privacyConsent}</p>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-md m-xl">
            <button
              className="btn btn-ghost order-2 sm:order-1"
              onClick={handlePrev}
              disabled={isSubmitting}
            >
              ← 이전
            </button>

            <button
              className={`btn btn-lg order-1 sm:order-2 ${
                privacyConsent && state.guided.contact.name && state.guided.contact.phone && state.guided.contact.email && state.guided.contact.preferredContactTime
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
              onClick={handleSubmit}
              disabled={isSubmitting || !privacyConsent || !state.guided.contact.name || !state.guided.contact.phone || !state.guided.contact.email || !state.guided.contact.preferredContactTime}
            >
              {isSubmitting ? '처리 중...' : '🎉 상담 신청 완료!'}
            </button>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}