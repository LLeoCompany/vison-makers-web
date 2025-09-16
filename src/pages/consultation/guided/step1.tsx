/**
 * VisionMakers 상담 시스템 - 가이드 트랙 1단계: 서비스 종류
 * 설계 문서 3.2 가이드 트랙 - Step 1 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import Button from '@/components/consultation/common/Button';
import RadioGroup from '@/components/consultation/common/RadioGroup';
import { useConsultation } from '@/contexts/ConsultationContext';
import {
  ServiceType,
  SERVICE_TYPE_DESCRIPTIONS
} from '@/types/consultation';

const serviceOptions = [
  {
    value: 'homepage' as ServiceType,
    label: '🏢 회사 홈페이지',
    description: SERVICE_TYPE_DESCRIPTIONS.homepage
  },
  {
    value: 'shopping' as ServiceType,
    label: '🛒 온라인 쇼핑몰',
    description: SERVICE_TYPE_DESCRIPTIONS.shopping
  },
  {
    value: 'booking' as ServiceType,
    label: '📅 예약/예매 시스템',
    description: SERVICE_TYPE_DESCRIPTIONS.booking
  },
  {
    value: 'membership' as ServiceType,
    label: '👥 회원제 서비스',
    description: SERVICE_TYPE_DESCRIPTIONS.membership
  },
  {
    value: 'other' as ServiceType,
    label: '❓ 잘 모르겠어요',
    description: SERVICE_TYPE_DESCRIPTIONS.other
  }
];

export default function GuidedStep1() {
  const router = useRouter();
  const { state, setServiceType, nextStep } = useConsultation();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!state.guided.serviceType) {
      setError('서비스 종류를 선택해주세요.');
      return;
    }

    setError('');
    nextStep();
    router.push('/consultation/guided/step2');
  };

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value as ServiceType);
    setError('');
  };

  return (
    <ConsultationLayout
      title="서비스 종류 선택"
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-sm border p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🎯 1/4단계 - 어떤 서비스가 필요하세요?
            </h1>
          </div>
          <p className="text-gray-600">
            하나를 선택해 주세요
          </p>
        </div>

        {/* 서비스 종류 선택 */}
        <div className="mb-8">
          <RadioGroup
            name="serviceType"
            value={state.guided.serviceType || ''}
            onChange={handleServiceTypeChange}
            options={serviceOptions}
            error={error}
          />
        </div>

        {/* 버튼들 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/consultation/start')}
          >
            ← 이전
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!state.guided.serviceType}
          >
            다음 단계로 →
          </Button>
        </div>

        {/* 도움말 */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-gray-500 text-xl">💡</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">
                <strong>잘 모르시겠다면?</strong><br />
                '잘 모르겠어요'를 선택하시면 전화 상담으로 함께 알아보겠습니다.
                어떤 선택을 하셔도 맞춤형 상담을 받으실 수 있어요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}