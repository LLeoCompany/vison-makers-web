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
      <div className="container">
        <div className="card">
          {/* 헤더 */}
          <div className="text-center m-xl">
            <h1 className="text-h2 text-primary">
              🎯 1/4단계 - 어떤 서비스가 필요하세요?
            </h1>
            <p className="text-body text-secondary m-md">
              하나를 선택해 주세요
            </p>
          </div>

          {/* 서비스 종류 선택 */}
          <div className="m-xl">
            <div className="grid gap-lg">
              {serviceOptions.map((option) => (
                <div
                  key={option.value}
                  className={`card-simple cursor-pointer transition-all duration-200 ${
                    state.guided.serviceType === option.value
                      ? 'border-red bg-red/5'
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleServiceTypeChange(option.value)}
                >
                  <div className="flex items-start gap-md">
                    <div className="text-2xl">{option.label.split(' ')[0]}</div>
                    <div className="flex-1">
                      <h3 className="text-h3 text-primary m-sm">
                        {option.label.substring(2)}
                      </h3>
                      <p className="text-body text-secondary">
                        {option.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        state.guided.serviceType === option.value
                          ? 'border-red bg-red'
                          : 'border-gray-300'
                      }`}>
                        {state.guided.serviceType === option.value && (
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
            {error && (
              <div className="text-red text-body-sm m-md">
                {error}
              </div>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex justify-between items-center m-xl">
            <button
              className="btn btn-ghost"
              onClick={() => router.push('/consultation/start')}
            >
              ← 이전
            </button>

            <button
              className={`btn btn-lg ${
                state.guided.serviceType ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={handleNext}
              disabled={!state.guided.serviceType}
            >
              다음 단계로 →
            </button>
          </div>

          {/* 도움말 */}
          <div className="card-simple" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div className="flex gap-md items-start">
              <div className="text-2xl">💡</div>
              <div>
                <p className="text-body text-blue">
                  <strong>잘 모르시겠다면?</strong><br />
                  '잘 모르겠어요'를 선택하시면 전화 상담으로 함께 알아보겠습니다.<br />
                  어떤 선택을 하셔도 맞춤형 상담을 받으실 수 있어요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}