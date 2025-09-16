/**
 * VisionMakers 상담 시스템 - 가이드 트랙 4단계: 연락처
 * 설계 문서 3.5 가이드 트랙 - Step 4 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import Button from '@/components/consultation/common/Button';
import RadioGroup from '@/components/consultation/common/RadioGroup';
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
      <div className="bg-white rounded-xl shadow-sm border p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 4/4단계 - 연락처만 알려주세요!
          </h1>
          <p className="text-gray-600">
            마지막 단계입니다. 연락처를 확인한 후 빠르게 연락드리겠습니다.
          </p>
        </div>

        {/* 기본 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            👤 기본 정보
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={state.guided.contact.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="홍길동"
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200
                  ${errors.name ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={state.guided.contact.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="010-1234-5678"
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200
                  ${errors.phone ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={state.guided.contact.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="hong@example.com"
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200
                  ${errors.email ? 'border-red-300' : 'border-gray-300'}
                `}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🏢 회사 정보 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회사명
            </label>
            <input
              type="text"
              value={state.guided.contact.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="회사명 또는 사업자명"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
            />
          </div>
        </div>

        {/* 연락 희망 시간 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📞 언제 연락드릴까요?
          </h2>
          <RadioGroup
            name="preferredContactTime"
            value={state.guided.contact.preferredContactTime || ''}
            onChange={handleContactTimeChange}
            options={contactTimeOptions}
            error={errors.preferredContactTime}
          />
        </div>

        {/* 개인정보 동의 */}
        <div className="mb-8">
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => {
                setPrivacyConsent(e.target.checked);
                setErrors(prev => ({ ...prev, privacyConsent: undefined }));
              }}
              className="w-5 h-5 mt-1 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-900">
                ✅ 개인정보 수집 동의 <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                상담을 위한 개인정보 수집에 동의합니다.<br />
                수집항목: 이름, 연락처, 이메일 | 보관기간: 1년
              </p>
              <button
                type="button"
                className="text-sm text-red-500 hover:text-red-700 underline mt-1"
                onClick={() => window.open('/privacy-policy', '_blank')}
              >
                개인정보처리방침 자세히보기
              </button>
            </div>
          </div>
          {errors.privacyConsent && (
            <p className="mt-2 text-sm text-red-600">{errors.privacyConsent}</p>
          )}
        </div>

        {/* 버튼들 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isSubmitting}
          >
            ← 이전
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            🎉 상담 신청 완료!
          </Button>
        </div>
      </div>
    </ConsultationLayout>
  );
}