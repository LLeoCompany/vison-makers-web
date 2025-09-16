/**
 * VisionMakers 상담 시스템 - 가이드 트랙 3단계: 일정과 특별 요청
 * 설계 문서 3.4 가이드 트랙 - Step 3 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
import Button from '@/components/consultation/common/Button';
import RadioGroup from '@/components/consultation/common/RadioGroup';
import { useConsultation } from '@/contexts/ConsultationContext';
import {
  Timeline,
  ImportantFeature,
  TIMELINE_DESCRIPTIONS,
  FEATURE_DESCRIPTIONS
} from '@/types/consultation';

const timelineOptions = [
  {
    value: '1month' as Timeline,
    label: TIMELINE_DESCRIPTIONS['1month'],
    description: '빠른 런칭이 필요한 경우'
  },
  {
    value: '2-3months' as Timeline,
    label: TIMELINE_DESCRIPTIONS['2-3months'],
    description: '일반적인 개발 기간',
    recommended: true
  },
  {
    value: '6months' as Timeline,
    label: TIMELINE_DESCRIPTIONS['6months'],
    description: '충분한 검토와 테스트 기간'
  },
  {
    value: 'flexible' as Timeline,
    label: TIMELINE_DESCRIPTIONS.flexible,
    description: '상담 후 일정 조율'
  }
];

const featureOptions = [
  { value: 'mobile' as ImportantFeature, label: FEATURE_DESCRIPTIONS.mobile },
  { value: 'seo' as ImportantFeature, label: FEATURE_DESCRIPTIONS.seo },
  { value: 'admin' as ImportantFeature, label: FEATURE_DESCRIPTIONS.admin },
  { value: 'payment' as ImportantFeature, label: FEATURE_DESCRIPTIONS.payment }
];

export default function GuidedStep3() {
  const router = useRouter();
  const {
    state,
    setTimeline,
    setFeatures,
    setAdditionalRequests,
    nextStep,
    prevStep
  } = useConsultation();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!state.guided.timeline) {
      setError('완성 희망 시기를 선택해주세요.');
      return;
    }

    setError('');
    nextStep();
    router.push('/consultation/guided/step4');
  };

  const handlePrev = () => {
    prevStep();
    router.push('/consultation/guided/step2');
  };

  const handleTimelineChange = (value: string) => {
    setTimeline(value as Timeline);
    setError('');
  };

  const handleFeatureToggle = (feature: ImportantFeature) => {
    const currentFeatures = state.guided.importantFeatures;
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];

    setFeatures(newFeatures);
  };

  const handleAdditionalRequestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdditionalRequests(e.target.value);
  };

  return (
    <ConsultationLayout
      title="일정과 특별 요청"
      showProgress={true}
    >
      <div className="bg-white rounded-xl shadow-sm border p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 3/4단계 - 언제까지 필요하고, 특별한 요청이 있나요?
          </h1>
          <p className="text-gray-600">
            일정과 중요한 기능을 알려주세요
          </p>
        </div>

        {/* 완성 희망 시기 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ⏰ 완성 희망 시기
          </h2>
          <RadioGroup
            name="timeline"
            value={state.guided.timeline || ''}
            onChange={handleTimelineChange}
            options={timelineOptions}
            error={error}
          />
        </div>

        {/* 특별히 중요한 기능 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 특별히 중요한 기능 <span className="text-sm font-normal text-gray-500">(여러개 선택 가능, 선택사항)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featureOptions.map((feature) => {
              const isSelected = state.guided.importantFeatures.includes(feature.value);
              return (
                <label
                  key={feature.value}
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleFeatureToggle(feature.value)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 mr-3 border-2 rounded flex items-center justify-center transition-all duration-200
                    ${isSelected
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">
                    {feature.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 기타 요청사항 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            💬 기타 요청사항 <span className="text-sm font-normal text-gray-500">(선택사항)</span>
          </h2>
          <textarea
            value={state.guided.additionalRequests}
            onChange={handleAdditionalRequestsChange}
            placeholder="참고할 사이트나 특별한 요청이 있으면 간단히 적어주세요&#10;예) &quot;네이버쇼핑몰 같은 디자인&quot;"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="mt-2 text-right">
            <span className="text-sm text-gray-500">
              {state.guided.additionalRequests.length}/500자
            </span>
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
            disabled={!state.guided.timeline}
          >
            마지막 단계로 →
          </Button>
        </div>
      </div>
    </ConsultationLayout>
  );
}