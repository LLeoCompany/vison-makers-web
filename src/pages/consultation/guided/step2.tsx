/**
 * VisionMakers 상담 시스템 - 가이드 트랙 2단계: 규모와 예산
 * 설계 문서 3.3 가이드 트랙 - Step 2 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
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
      <div className="container">
        <div className="card">
          {/* 헤더 */}
          <div className="text-center m-xl">
            <h1 className="text-h2 text-primary">
              🎯 2/4단계 - 규모와 예산은 어느 정도인가요?
            </h1>
            <p className="text-body text-secondary m-md">
              대략적인 규모를 선택하면 더 정확한 상담이 가능해요
            </p>
          </div>

          {/* 프로젝트 규모 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              📏 프로젝트 규모
            </h2>
            <div className="grid gap-md">
              {projectSizeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`card-simple cursor-pointer transition-all duration-200 ${
                    state.guided.projectSize === option.value
                      ? 'border-red bg-red/5'
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleProjectSizeChange(option.value)}
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
                        state.guided.projectSize === option.value
                          ? 'border-red bg-red'
                          : 'border-gray-300'
                      }`}>
                        {state.guided.projectSize === option.value && (
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
            {errors.size && (
              <div className="text-red text-body-sm m-md">
                {errors.size}
              </div>
            )}
          </div>

          {/* 예상 예산 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              💰 예상 예산
            </h2>
            <div className="grid gap-md">
              {budgetOptions.map((option) => (
                <div
                  key={option.value}
                  className={`card-simple cursor-pointer transition-all duration-200 ${
                    state.guided.budget === option.value
                      ? 'border-red bg-red/5'
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleBudgetChange(option.value)}
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
                        state.guided.budget === option.value
                          ? 'border-red bg-red'
                          : 'border-gray-300'
                      }`}>
                        {state.guided.budget === option.value && (
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
            {errors.budget && (
              <div className="text-red text-body-sm m-md">
                {errors.budget}
              </div>
            )}
          </div>

          {/* 참고 정보 */}
          <div className="card-simple" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div className="flex gap-md items-start">
              <div className="text-2xl">✅</div>
              <div>
                <p className="text-body text-blue">
                  <strong>참고사항</strong><br />
                  대부분 고객님들이 <span className="text-red">300-800만원 범위</span>에서 프로젝트를 진행하십니다.<br />
                  정확한 견적은 상세한 요구사항을 확인한 후 제공해드려요.
                </p>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex justify-between items-center m-xl">
            <button
              className="btn btn-ghost"
              onClick={handlePrev}
            >
              ← 이전
            </button>

            <button
              className={`btn btn-lg ${
                state.guided.projectSize && state.guided.budget ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={handleNext}
              disabled={!state.guided.projectSize || !state.guided.budget}
            >
              다음 단계로 →
            </button>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}