/**
 * VisionMakers 가이드 상담 - 1단계: 서비스 종류 선택 (Toss UI 스타일)
 * 설계 문서 4.2 UI/UX 플로우 기반 + Toss 디자인 패턴 적용
 */

import React from 'react';
import { useRouter } from 'next/router';
import { useConsultation } from '../../../contexts/ConsultationContext';
import { ServiceType, SERVICE_TYPE_DESCRIPTIONS } from '../../../types/consultation';

const GuidedStep1Page: React.FC = () => {
  const router = useRouter();
  const { state, setServiceType, nextStep } = useConsultation();

  const handleServiceSelection = (serviceType: ServiceType) => {
    setServiceType(serviceType);
    setTimeout(() => {
      nextStep();
      router.push('/consultation/guided/step2');
    }, 100);
  };

  const serviceOptions = [
    {
      key: 'homepage' as ServiceType,
      title: '홈페이지/브랜드 사이트',
      description: SERVICE_TYPE_DESCRIPTIONS.homepage,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      examples: '회사 소개, 제품 홍보, 포트폴리오'
    },
    {
      key: 'shopping' as ServiceType,
      title: '온라인 쇼핑몰',
      description: SERVICE_TYPE_DESCRIPTIONS.shopping,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
        </svg>
      ),
      examples: '상품 판매, 장바구니, 결제 시스템'
    },
    {
      key: 'booking' as ServiceType,
      title: '예약 시스템',
      description: SERVICE_TYPE_DESCRIPTIONS.booking,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      examples: '병원, 미용실, 펜션, 레스토랑'
    },
    {
      key: 'membership' as ServiceType,
      title: '회원제 사이트',
      description: SERVICE_TYPE_DESCRIPTIONS.membership,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      examples: '커뮤니티, 학습 플랫폼, 회원 서비스'
    },
    {
      key: 'other' as ServiceType,
      title: '기타/복합 서비스',
      description: SERVICE_TYPE_DESCRIPTIONS.other,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      examples: '특별한 요구사항이 있는 프로젝트'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 진행 상황 헤더 - Toss 스타일 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.push('/consultation/start')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-500">1/4 단계</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1">
            <div className="bg-blue-600 h-1 rounded-full transition-all duration-300" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            어떤 종류의
            <br />
            <span className="text-blue-500">웹사이트</span>가 필요하신가요?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            가장 가까운 서비스 유형을 선택해주세요.<br />
            정확한 견적과 기능 추천을 위해 중요한 정보예요.
          </p>
        </div>

        {/* 서비스 선택 옵션 - Toss 카드 스타일 */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {serviceOptions.map((option) => (
            <div
              key={option.key}
              className={`relative bg-white rounded-2xl p-6 cursor-pointer border transition-all duration-300 hover:shadow-lg group ${
                state.guided.serviceType === option.key
                  ? 'border-blue-500 shadow-lg ring-4 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleServiceSelection(option.key)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  state.guided.serviceType === option.key
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-bold mb-2 transition-colors ${
                    state.guided.serviceType === option.key ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {option.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                    {option.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    예: {option.examples}
                  </p>
                </div>
                {state.guided.serviceType === option.key && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 네비게이션 - Toss 스타일 */}
        <div className="flex justify-center">
          {state.guided.serviceType && (
            <button
              onClick={() => {
                nextStep();
                router.push('/consultation/guided/step2');
              }}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg flex items-center"
            >
              다음으로
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* 도움말 - Toss 스타일 */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">잘 모르겠다면?</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                정확히 어떤 유형인지 확실하지 않다면 <strong>"기타/복합 서비스"</strong>를 선택해주세요.
                전문가가 상담을 통해 최적의 솔루션을 제안해드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedStep1Page;