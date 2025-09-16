/**
 * VisionMakers 상담 시스템 - 가이드 트랙 2단계: 규모와 예산
 * 설계 문서 3.3 가이드 트랙 - Step 2 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import Button from '@/components/consultation/common/Button';
import RadioGroup from '@/components/consultation/common/RadioGroup';
import { useConsultation } from '@/contexts/ConsultationContext';
import {
  ProjectSize,
  Budget,
  PROJECT_SIZE_DESCRIPTIONS,
  BUDGET_DESCRIPTIONS
} from '@/types/consultation';

const projectSizeOptions = [
  {
    value: 'small' as ProjectSize,
    label: PROJECT_SIZE_DESCRIPTIONS.small,
    description: '기본 페이지와 간단한 기능 포함'
  },
  {
    value: 'medium' as ProjectSize,
    label: PROJECT_SIZE_DESCRIPTIONS.medium,
    description: '다양한 페이지와 중간 수준의 기능 포함',
    recommended: true
  },
  {
    value: 'large' as ProjectSize,
    label: PROJECT_SIZE_DESCRIPTIONS.large,
    description: '복합적인 기능과 고급 관리 시스템 포함'
  }
];

const budgetOptions = [
  {
    value: '100-300' as Budget,
    label: BUDGET_DESCRIPTIONS['100-300'],
    description: '기본형 웹사이트에 적합'
  },
  {
    value: '300-800' as Budget,
    label: BUDGET_DESCRIPTIONS['300-800'],
    description: '대부분 고객님들이 선택하는 범위',
    recommended: true
  },
  {
    value: '800-1500' as Budget,
    label: BUDGET_DESCRIPTIONS['800-1500'],
    description: '고급 기능과 디자인 포함'
  },
  {
    value: '1500+' as Budget,
    label: BUDGET_DESCRIPTIONS['1500+'],
    description: '프리미엄 솔루션'
  },
  {
    value: 'consult' as Budget,
    label: BUDGET_DESCRIPTIONS.consult,
    description: '상세한 논의 후 견적 산출'
  }
];

export default function GuidedStep2() {
  const router = useRouter();
  const { state, setProjectSize, setBudget, nextStep, prevStep } = useConsultation();
  const [errors, setErrors] = useState<{ size?: string; budget?: string }>({});

  const handleNext = () => {
    const newErrors: { size?: string; budget?: string } = {};

    if (!state.guided.projectSize) {
      newErrors.size = '프로젝트 규모를 선택해주세요.';
    }

    if (!state.guided.budget) {
      newErrors.budget = '예상 예산을 선택해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    nextStep();
    router.push('/consultation/guided/step3');
  };

  const handlePrev = () => {
    prevStep();
    router.push('/consultation/guided/step1');
  };

  const handleProjectSizeChange = (value: string) => {
    setProjectSize(value as ProjectSize);
    setErrors(prev => ({ ...prev, size: undefined }));
  };

  const handleBudgetChange = (value: string) => {
    setBudget(value as Budget);
    setErrors(prev => ({ ...prev, budget: undefined }));
  };

  return (
    <ConsultationLayout
      title="규모와 예산 설정"
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-sm border p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 2/4단계 - 규모와 예산은 어느 정도인가요?
          </h1>
          <p className="text-gray-600">
            대략적인 규모를 선택하면 더 정확한 상담이 가능해요
          </p>
        </div>

        {/* 프로젝트 규모 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📏 프로젝트 규모
          </h2>
          <RadioGroup
            name="projectSize"
            value={state.guided.projectSize || ''}
            onChange={handleProjectSizeChange}
            options={projectSizeOptions}
            error={errors.size}
          />
        </div>

        {/* 예상 예산 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            💰 예상 예산
          </h2>
          <RadioGroup
            name="budget"
            value={state.guided.budget || ''}
            onChange={handleBudgetChange}
            options={budgetOptions}
            error={errors.budget}
          />
        </div>

        {/* 참고 정보 */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-500 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>참고사항</strong><br />
                대부분 고객님들이 <span className="font-semibold">300-800만원 범위</span>에서 프로젝트를 진행하십니다.
                정확한 견적은 상세한 요구사항을 확인한 후 제공해드려요.
              </p>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
          >
            ← 이전
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!state.guided.projectSize || !state.guided.budget}
          >
            다음 단계로 →
          </Button>
        </div>
      </div>
    </ConsultationLayout>
  );
}