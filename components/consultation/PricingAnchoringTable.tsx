/**
 * VisionMakers 가격 앵커링 테이블 컴포넌트
 * 행동경제학 앵커링 효과를 활용한 가격 비교 테이블
 */

import React from 'react';

interface PricingOption {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  isRecommended?: boolean;
  isPopular?: boolean;
}

interface PricingAnchoringTableProps {
  options?: PricingOption[];
  title?: string;
  subtitle?: string;
}

const defaultOptions: PricingOption[] = [
  {
    id: 'basic',
    name: '기본형',
    price: '300만원',
    originalPrice: '500만원',
    features: [
      '반응형 웹사이트',
      '기본 SEO 설정',
      '연락처 폼',
      '3개월 유지보수'
    ]
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: '800만원',
    originalPrice: '1,200만원',
    features: [
      '고급 반응형 웹사이트',
      '전문 SEO 최적화',
      '관리자 시스템',
      '예약/문의 시스템',
      '6개월 유지보수',
      '성과 분석 리포트'
    ],
    isRecommended: true,
    isPopular: true
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: '1,500만원',
    originalPrice: '2,000만원',
    features: [
      '맞춤형 웹 플랫폼',
      '고급 SEO + 마케팅',
      '완전한 관리자 시스템',
      '결제 시스템 연동',
      '1년 유지보수',
      '전담 매니저',
      '월간 성과 리포트',
      '24/7 기술 지원'
    ]
  }
];

export default function PricingAnchoringTable({
  options = defaultOptions,
  title = "💰 특별 할인가 (런칭 기념)",
  subtitle = "지금 신청하시면 최대 40% 할인 혜택을 받으실 수 있습니다"
}: PricingAnchoringTableProps) {
  return (
    <div className="pricing-anchoring-table">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`pricing-card relative ${
              option.isRecommended
                ? 'border-2 border-red-500 shadow-lg scale-105 z-10'
                : 'border border-gray-200 shadow-md'
            } rounded-lg p-6 bg-white transition-all duration-300 hover:shadow-xl`}
          >
            {option.isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  🔥 가장 인기
                </span>
              </div>
            )}

            {option.isRecommended && (
              <div className="absolute -top-4 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ⭐ 추천
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{option.name}</h4>

              <div className="price-container mb-4">
                {option.originalPrice && (
                  <div className="text-gray-400 line-through text-sm mb-1">
                    {option.originalPrice}
                  </div>
                )}
                <div className={`text-3xl font-bold ${
                  option.isRecommended ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {option.price}
                </div>
                {option.originalPrice && (
                  <div className="text-red-500 text-sm font-semibold mt-1">
                    {Math.round((1 - parseInt(option.price.replace(/[^0-9]/g, '')) / parseInt(option.originalPrice.replace(/[^0-9]/g, ''))) * 100)}% 할인
                  </div>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {option.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✓</span>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                option.isRecommended
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
              onClick={() => {
                // 상담 신청 페이지로 이동 또는 모달 열기
                window.location.href = `/consultation/start?package=${option.id}`;
              }}
            >
              {option.isRecommended ? '🚀 지금 신청하기' : '상담 신청'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg inline-block">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⏰</div>
            <div>
              <p className="text-yellow-800 font-semibold">한정 특가 마감까지</p>
              <p className="text-yellow-700 text-sm">이 가격은 이번 달까지만 제공됩니다</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pricing-anchoring-table {
          margin: 2rem 0;
        }

        .pricing-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
        }

        .price-container {
          position: relative;
        }

        @media (max-width: 768px) {
          .pricing-card {
            margin-bottom: 2rem;
          }

          .scale-105 {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}