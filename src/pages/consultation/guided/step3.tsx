/**
 * VisionMakers 상담 시스템 - 가이드 트랙 3단계: 일정과 특별 요청
 * 설계 문서 3.4 가이드 트랙 - Step 3 기반
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ConsultationLayout from '@/components/consultation/ConsultationLayout';
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
      <div className="container">
        <div className="card">
          {/* 헤더 */}
          <div className="text-center m-xl">
            <h1 className="text-h2 text-primary">
              🎯 3/4단계 - 언제까지 필요하고, 특별한 요청이 있나요?
            </h1>
            <p className="text-body text-secondary m-md">
              일정과 중요한 기능을 알려주세요
            </p>
          </div>

          {/* 완성 희망 시기 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              ⏰ 완성 희망 시기
            </h2>
            <div className="grid gap-md">
              {timelineOptions.map((option) => (
                <div
                  key={option.value}
                  className={`card-simple cursor-pointer transition-all duration-200 ${
                    state.guided.timeline === option.value
                      ? 'border-red bg-red/5'
                      : 'hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleTimelineChange(option.value)}
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
                        state.guided.timeline === option.value
                          ? 'border-red bg-red'
                          : 'border-gray-300'
                      }`}>
                        {state.guided.timeline === option.value && (
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

          {/* 특별히 중요한 기능 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              🎯 특별히 중요한 기능 <span className="text-body-sm text-secondary">(여러개 선택 가능, 선택사항)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {featureOptions.map((feature) => {
                const isSelected = state.guided.importantFeatures.includes(feature.value);
                return (
                  <div
                    key={feature.value}
                    className={`card-simple cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-red bg-red/5'
                        : 'hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => handleFeatureToggle(feature.value)}
                  >
                    <div className="flex items-center gap-md">
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                        isSelected
                          ? 'border-red bg-red'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-body text-primary">
                        {feature.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 기타 요청사항 */}
          <div className="m-xl">
            <h2 className="text-h3 text-primary m-lg">
              💬 기타 요청사항 <span className="text-body-sm text-secondary">(선택사항)</span>
            </h2>
            <div className="card-simple">
              <textarea
                value={state.guided.additionalRequests}
                onChange={handleAdditionalRequestsChange}
                placeholder="참고할 사이트나 특별한 요청이 있으면 간단히 적어주세요&#10;예) &quot;네이버쇼핑몰 같은 디자인&quot;"
                className="w-full p-0 border-0 text-body text-primary bg-transparent resize-none focus:outline-none"
                rows={4}
                maxLength={500}
                style={{ fontFamily: 'var(--font-family)' }}
              />
              <div className="text-right m-sm">
                <span className="text-body-sm text-secondary">
                  {state.guided.additionalRequests.length}/500자
                </span>
              </div>
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-md m-xl">
            <button
              className="btn btn-ghost order-2 sm:order-1"
              onClick={handlePrev}
            >
              ← 이전
            </button>

            <button
              className={`btn btn-lg order-1 sm:order-2 ${
                state.guided.timeline ? 'btn-primary' : 'btn-secondary'
              }`}
              onClick={handleNext}
              disabled={!state.guided.timeline}
            >
              마지막 단계로 →
            </button>
          </div>
        </div>
      </div>
    </ConsultationLayout>
  );
}