/**
 * 최적화된 가이드 상담 플로우 컴포넌트
 * 심리학 기반 UX와 이탈률 최소화 적용
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useConsultation } from '@/contexts/ConsultationContext';
import { useConsultationSubmit } from '@/hooks/useConsultationSubmit';
import { ProgressBar } from './shared/ProgressBar';
import { NavigationButtons } from './shared/NavigationButtons';
import { StepTransition } from './shared/StepTransition';

// 서비스 타입 정의 (FAB 이론 적용)
const SERVICE_TYPES = [
  {
    value: 'web_development',
    icon: '🏢',
    title: '웹사이트 개발',
    description: '홈페이지, 쇼핑몰 등',
    examples: '카페, 병원, 회사 소개',
    fab: {
      feature: '반응형 디자인 + SEO 최적화',
      advantage: '모든 기기에서 완벽 표시',
      benefit: '월 방문자 300% 증가'
    }
  },
  {
    value: 'mobile_app',
    icon: '📱',
    title: '모바일 앱 개발',
    description: 'iOS, Android 앱 개발',
    examples: '비즈니스 앱, 게임, 유틸리티',
    fab: {
      feature: '결제 시스템 + 재고 관리',
      advantage: '24시간 자동 판매',
      benefit: '오프라인 매출의 200% 추가'
    }
  },
  {
    value: 'ai_ml',
    icon: '🤖',
    title: 'AI/머신러닝',
    description: '인공지능 솔루션',
    examples: '챗봇, 예측 시스템, 데이터 분석',
    fab: {
      feature: '실시간 예약 + 자동 알림',
      advantage: '24시간 예약 접수',
      benefit: '노쇼율 70% 감소'
    }
  },
  {
    value: 'consulting',
    icon: '📈',
    title: 'IT 컨설팅',
    description: '기술 자문 및 전략 수립',
    examples: '디지털 전환, 시스템 개선, 기술 도입',
    fab: {
      feature: '회원 관리 + 커뮤니티',
      advantage: '고객 데이터 축적',
      benefit: '재방문율 80% 증가'
    }
  },
  {
    value: 'other',
    icon: '💡',
    title: '기타/특수 요구사항',
    description: '전화로 함께 알아보기',
    examples: '맞춤형 솔루션',
    fab: {
      feature: '맞춤 개발',
      advantage: '완전한 요구사항 반영',
      benefit: '100% 만족 보장'
    }
  }
];

export const OptimizedGuidedConsultation: React.FC = () => {
  const router = useRouter();
  const { step } = router.query;
  const currentStep = parseInt(step as string) || 1;

  const {
    state,
    nextStep,
    prevStep,
    setServiceType,
    setProjectSize,
    setBudget,
    setTimeline,
    setFeatures,
    setAdditionalRequests,
    setContact,
    canProceedToNext
  } = useConsultation();

  const { submitConsultation, isSubmitting, error } = useConsultationSubmit();

  const [isAnimating, setIsAnimating] = useState(false);
  const [timeOnStep, setTimeOnStep] = useState(0);

  // 단계별 체류 시간 추적
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      gtag('event', 'step_time_spent', {
        step: currentStep,
        duration_ms: duration,
        consultation_type: 'guided'
      });
    };
  }, [currentStep]);

  // 이탈 방지 - 페이지 이탈 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentStep > 1) {
        e.preventDefault();
        e.returnValue = '입력하신 정보가 사라집니다. 정말 나가시겠습니까?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep]);

  const handleNext = async () => {
    if (!canProceedToNext()) return;

    setIsAnimating(true);

    // 마지막 단계에서 제출
    if (currentStep === 4) {
      await handleSubmit();
    } else {
      // 단계 진행 이벤트 추적
      gtag('event', 'step_completed', {
        step: currentStep,
        consultation_type: 'guided',
        time_on_step: timeOnStep
      });

      setTimeout(() => {
        nextStep();
        router.push(`/consultation/guided/step-${currentStep + 1}`);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    setIsAnimating(true);

    setTimeout(() => {
      prevStep();
      router.push(`/consultation/guided/step-${currentStep - 1}`);
      setIsAnimating(false);
    }, 300);
  };

  const handleSubmit = async () => {
    try {
      const consultationData = {
        type: 'guided' as const,
        serviceType: state.guided.serviceType!,
        projectSize: state.guided.projectSize!,
        budget: state.guided.budget!,
        timeline: state.guided.timeline!,
        importantFeatures: state.guided.importantFeatures,
        additionalRequests: state.guided.additionalRequests,
        contact: state.guided.contact as any
      };

      await submitConsultation(consultationData);

      // 성공 이벤트 추적
      gtag('event', 'consultation_completed', {
        consultation_type: 'guided',
        service_type: state.guided.serviceType,
        project_size: state.guided.projectSize,
        budget: state.guided.budget
      });

    } catch (error) {
      console.error('Consultation submission failed:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1ServiceType onSelect={setServiceType} />;
      case 2:
        return <Step2SizeAndBudget onSizeSelect={setProjectSize} onBudgetSelect={setBudget} />;
      case 3:
        return <Step3TimelineAndFeatures
          onTimelineSelect={setTimeline}
          onFeaturesSelect={setFeatures}
          onAdditionalRequestsChange={setAdditionalRequests}
        />;
      case 4:
        return <Step4Contact onContactChange={setContact} />;
      default:
        return null;
    }
  };

  return (
    <div className="guided-consultation">
      {/* 진행률 표시 */}
      <div className="consultation-header">
        <div className="container">
          <ProgressBar current={currentStep} total={4} />

          {/* 단계별 안내 메시지 */}
          <div className="step-guidance">
            <StepGuidanceMessage step={currentStep} />
          </div>
        </div>
      </div>

      {/* 단계별 콘텐츠 */}
      <div className="consultation-content">
        <div className="container">
          <StepTransition isAnimating={isAnimating}>
            {renderStepContent()}
          </StepTransition>

          {/* 에러 메시지 */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* 네비게이션 */}
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={4}
            canProceed={canProceedToNext()}
            isSubmitting={isSubmitting}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      </div>

      {/* 안심 요소 - 하단 고정 */}
      <div className="consultation-footer">
        <div className="container">
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span className="trust-text">개인정보 보호</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💯</span>
              <span className="trust-text">100% 무료</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <span className="trust-text">24시간 응답</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: 서비스 타입 선택 (FAB 이론 적용)
interface Step1Props {
  onSelect: (serviceType: any) => void;
}

const Step1ServiceType: React.FC<Step1Props> = ({ onSelect }) => {
  const { state } = useConsultation();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="step-content step-1">
      <div className="step-header">
        <h2 className="step-title">어떤 종류의 웹사이트가 필요하신가요?</h2>
        <p className="step-description">가장 가까운 것을 선택해주세요</p>
      </div>

      <div className="service-options">
        {SERVICE_TYPES.map((service) => (
          <div
            key={service.value}
            className={`service-card ${
              state.guided.serviceType === service.value ? 'selected' : ''
            } ${hoveredCard === service.value ? 'hovered' : ''}`}
            onClick={() => onSelect(service.value)}
            onMouseEnter={() => setHoveredCard(service.value)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-examples">예시: {service.examples}</div>

            {/* FAB 정보 (호버 시 표시) */}
            {hoveredCard === service.value && (
              <div className="fab-info">
                <div className="fab-item">
                  <strong>기능:</strong> {service.fab.feature}
                </div>
                <div className="fab-item">
                  <strong>장점:</strong> {service.fab.advantage}
                </div>
                <div className="fab-item benefit">
                  <strong>고객 이익:</strong> {service.fab.benefit}
                </div>
              </div>
            )}

            {state.guided.serviceType === service.value && (
              <div className="selection-check">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 2: 규모와 예산 (앵커링 효과 적용)
interface Step2Props {
  onSizeSelect: (size: any) => void;
  onBudgetSelect: (budget: any) => void;
}

const Step2SizeAndBudget: React.FC<Step2Props> = ({ onSizeSelect, onBudgetSelect }) => {
  const { state } = useConsultation();

  const projectSizes = [
    {
      value: 'small',
      title: '간단하게',
      description: '5-10 페이지 정도',
      examples: '기본 소개, 연락처',
      timeEstimate: '2-3주',
      recommendation: '스타트업 추천'
    },
    {
      value: 'medium',
      title: '보통 규모',
      description: '10-20 페이지',
      examples: '상품목록, 갤러리, 블로그',
      timeEstimate: '4-6주',
      recommendation: '중소기업 추천'
    },
    {
      value: 'large',
      title: '큰 규모',
      description: '20페이지 이상',
      examples: '복잡한 기능, 관리자 페이지',
      timeEstimate: '8-12주',
      recommendation: '대기업 수준'
    }
  ];

  const budgetRanges = [
    {
      value: '1000_to_3000',
      amount: '100~300만원',
      suitable: '간단한 홈페이지',
      savings: '타 업체 대비 70% 절약',
      anchor: false
    },
    {
      value: '3000_to_5000',
      amount: '300~500만원',
      suitable: '기능이 있는 사이트',
      savings: '타 업체 대비 60% 절약',
      anchor: false,
      popular: true
    },
    {
      value: '5000_to_10000',
      amount: '500~1000만원',
      suitable: '복잡한 시스템',
      savings: '타 업체 대비 50% 절약',
      anchor: false
    },
    {
      value: 'over_10000',
      amount: '1000만원 이상',
      suitable: '대규모 프로젝트',
      savings: '맞춤 견적',
      anchor: false
    },
    {
      value: 'negotiable',
      amount: '상담받고 결정',
      suitable: '예산을 잘 모르겠어요',
      savings: '최적 예산 제안',
      anchor: false
    }
  ];

  return (
    <div className="step-content step-2">
      <div className="step-header">
        <h2 className="step-title">프로젝트 규모와 예산을 알려주세요</h2>
        <p className="step-description">정확한 견적을 위해 필요한 정보입니다</p>
      </div>

      <div className="section-group">
        {/* 프로젝트 규모 */}
        <div className="form-section">
          <h3 className="section-title">프로젝트 규모</h3>
          <div className="size-options">
            {projectSizes.map((size) => (
              <div
                key={size.value}
                className={`size-card ${
                  state.guided.projectSize === size.value ? 'selected' : ''
                }`}
                onClick={() => onSizeSelect(size.value)}
              >
                <h4 className="size-title">{size.title}</h4>
                <p className="size-description">{size.description}</p>
                <div className="size-examples">{size.examples}</div>
                <div className="size-meta">
                  <div className="time-estimate">⏱️ {size.timeEstimate}</div>
                  <div className="recommendation">👍 {size.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 예산 범위 */}
        <div className="form-section">
          <h3 className="section-title">
            예산 범위
            <span className="section-subtitle">솔직한 가격으로 안내드려요</span>
          </h3>

          {/* 앵커링 효과 - 경쟁사 가격 먼저 표시 */}
          <div className="anchor-pricing">
            <div className="anchor-item">
              <span className="anchor-label">대형 에이전시 평균</span>
              <span className="anchor-price">5,000만원</span>
              <span className="anchor-note">😱 너무 비싸요</span>
            </div>
            <div className="anchor-item">
              <span className="anchor-label">중형 업체 평균</span>
              <span className="anchor-price">2,500만원</span>
              <span className="anchor-note">🤔 여전히 부담</span>
            </div>
          </div>

          <div className="our-pricing-intro">
            <h4>VisionMakers 합리적 가격 💰</h4>
            <p>같은 품질, 절반 가격으로 제공합니다</p>
          </div>

          <div className="budget-options">
            {budgetRanges.map((budget) => (
              <div
                key={budget.value}
                className={`budget-card ${
                  state.guided.budget === budget.value ? 'selected' : ''
                } ${budget.popular ? 'popular' : ''}`}
                onClick={() => onBudgetSelect(budget.value)}
              >
                {budget.popular && <div className="popular-badge">인기</div>}

                <div className="budget-amount">{budget.amount}</div>
                <div className="budget-suitable">{budget.suitable}</div>
                <div className="budget-savings">{budget.savings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: 일정과 중요 기능
interface Step3Props {
  onTimelineSelect: (timeline: any) => void;
  onFeaturesSelect: (features: any[]) => void;
  onAdditionalRequestsChange: (requests: string) => void;
}

const Step3TimelineAndFeatures: React.FC<Step3Props> = ({
  onTimelineSelect,
  onFeaturesSelect,
  onAdditionalRequestsChange
}) => {
  const { state } = useConsultation();

  const timelines = [
    {
      value: '1_month',
      icon: '⚡',
      title: '1개월 이내',
      subtitle: '급해요!',
      description: '빠른 진행 (추가 비용 있음)',
      urgency: 'high'
    },
    {
      value: '1_3_months',
      icon: '⏰',
      title: '1-3개월 정도',
      subtitle: '적당히',
      description: '일반적인 진행 속도',
      urgency: 'medium',
      popular: true
    },
    {
      value: '3_6_months',
      icon: '🌱',
      title: '3-6개월 이내',
      subtitle: '여유있게',
      description: '충분한 검토와 개선',
      urgency: 'low'
    },
    {
      value: 'flexible',
      icon: '🤷',
      title: '일정은 상관없어요',
      subtitle: '품질 우선',
      description: '최고 품질로 제작',
      urgency: 'none'
    }
  ];

  const features = [
    {
      value: 'mobile',
      icon: '📱',
      title: '모바일 최적화',
      description: '모바일에서 잘 보이게',
      importance: 'high',
      benefit: '모바일 트래픽 70% 차지'
    },
    {
      value: 'seo',
      icon: '🔍',
      title: '검색엔진 최적화',
      description: '네이버/구글 검색 잘 되게',
      importance: 'high',
      benefit: '자연 유입 300% 증가'
    },
    {
      value: 'admin',
      icon: '⚙️',
      title: '관리자 페이지',
      description: '내용을 쉽게 수정',
      importance: 'medium',
      benefit: '관리 비용 월 50만원 절약'
    },
    {
      value: 'payment',
      icon: '💳',
      title: '결제 기능',
      description: '온라인 결제 시스템',
      importance: 'medium',
      benefit: '매출 채널 확대'
    }
  ];

  const handleFeatureToggle = (featureValue: string) => {
    const currentFeatures = state.guided.importantFeatures;
    const isSelected = currentFeatures.includes(featureValue);

    if (isSelected) {
      onFeaturesSelect(currentFeatures.filter(f => f !== featureValue));
    } else {
      onFeaturesSelect([...currentFeatures, featureValue]);
    }
  };

  return (
    <div className="step-content step-3">
      <div className="step-header">
        <h2 className="step-title">일정과 중요한 기능을 선택해주세요</h2>
        <p className="step-description">프로젝트 계획 수립을 위해 필요합니다</p>
      </div>

      <div className="section-group">
        {/* 일정 선택 */}
        <div className="form-section">
          <h3 className="section-title">원하는 완료 시기</h3>
          <div className="timeline-options">
            {timelines.map((timeline) => (
              <div
                key={timeline.value}
                className={`timeline-card ${
                  state.guided.timeline === timeline.value ? 'selected' : ''
                } ${timeline.popular ? 'popular' : ''} urgency-${timeline.urgency}`}
                onClick={() => onTimelineSelect(timeline.value)}
              >
                {timeline.popular && <div className="popular-badge">추천</div>}

                <div className="timeline-icon">{timeline.icon}</div>
                <h4 className="timeline-title">{timeline.title}</h4>
                <div className="timeline-subtitle">{timeline.subtitle}</div>
                <div className="timeline-description">{timeline.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 중요 기능 선택 */}
        <div className="form-section">
          <h3 className="section-title">
            중요하게 생각하는 기능
            <span className="section-subtitle">복수 선택 가능해요</span>
          </h3>
          <div className="features-grid">
            {features.map((feature) => (
              <div
                key={feature.value}
                className={`feature-card ${
                  state.guided.importantFeatures.includes(feature.value) ? 'selected' : ''
                } importance-${feature.importance}`}
                onClick={() => handleFeatureToggle(feature.value)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-benefit">💡 {feature.benefit}</div>

                {state.guided.importantFeatures.includes(feature.value) && (
                  <div className="feature-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 추가 요청사항 */}
        <div className="form-section">
          <h3 className="section-title">
            추가 요청사항
            <span className="section-subtitle">선택사항이에요</span>
          </h3>
          <div className="additional-requests">
            <textarea
              placeholder="특별히 원하는 기능이나 디자인, 참고할 사이트가 있다면 알려주세요&#10;&#10;예시:&#10;• 네이버 카페 같은 커뮤니티 기능&#10;• 인스타그램 연동&#10;• 다국어 지원"
              value={state.guided.additionalRequests}
              onChange={(e) => onAdditionalRequestsChange(e.target.value)}
              className="requests-textarea"
              maxLength={500}
              rows={6}
            />
            <div className="character-count">
              {state.guided.additionalRequests.length}/500
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: 연락처 정보
interface Step4Props {
  onContactChange: (contact: any) => void;
}

const Step4Contact: React.FC<Step4Props> = ({ onContactChange }) => {
  const { state } = useConsultation();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const contactTimes = [
    {
      value: 'morning',
      icon: '🌅',
      title: '평일 오전',
      time: '9시-12시',
      description: '업무 시작 전 상담'
    },
    {
      value: 'afternoon',
      icon: '☀️',
      title: '평일 오후',
      time: '1시-6시',
      description: '업무 시간 중 상담',
      popular: true
    },
    {
      value: 'evening',
      icon: '🌆',
      title: '평일 저녁',
      time: '6시-8시',
      description: '업무 후 상담'
    },
    {
      value: 'anytime',
      icon: '⏰',
      title: '언제든',
      time: '괜찮아요',
      description: '시간 상관없이'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    onContactChange({
      ...state.guided.contact,
      [field]: value
    });
  };

  const handleContactTimeSelect = (time: string) => {
    onContactChange({
      ...state.guided.contact,
      preferredContactTime: time
    });
  };

  return (
    <div className="step-content step-4">
      <div className="step-header">
        <h2 className="step-title">연락처를 입력해주세요</h2>
        <p className="step-description">입력해주신 정보로 상담 결과를 안내드릴게요</p>
      </div>

      <div className="contact-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label required">이름</label>
            <input
              type="text"
              placeholder="홍길동"
              value={state.guided.contact.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">연락처</label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              value={state.guided.contact.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label required">이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={state.guided.contact.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">회사명 (선택사항)</label>
            <input
              type="text"
              placeholder="(주)회사명"
              value={state.guided.contact.company || ''}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* 연락 시간 선택 */}
        <div className="form-section">
          <h3 className="section-title required">연락받기 편한 시간</h3>
          <div className="contact-time-options">
            {contactTimes.map((time) => (
              <div
                key={time.value}
                className={`contact-time-card ${
                  state.guided.contact.preferredContactTime === time.value ? 'selected' : ''
                } ${time.popular ? 'popular' : ''}`}
                onClick={() => handleContactTimeSelect(time.value)}
              >
                {time.popular && <div className="popular-badge">추천</div>}

                <div className="time-icon">{time.icon}</div>
                <h4 className="time-title">{time.title}</h4>
                <div className="time-range">{time.time}</div>
                <div className="time-description">{time.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 개인정보 동의 */}
        <div className="agreement-section">
          <label className="agreement-label">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="agreement-checkbox"
              required
            />
            <span className="agreement-text">
              개인정보 수집 및 이용에 동의합니다.
              <a href="/privacy" target="_blank" className="privacy-link">
                자세히 보기
              </a>
            </span>
          </label>

          <div className="privacy-summary">
            <div className="privacy-item">
              <strong>수집 항목:</strong> 이름, 연락처, 이메일
            </div>
            <div className="privacy-item">
              <strong>이용 목적:</strong> 상담 서비스 제공
            </div>
            <div className="privacy-item">
              <strong>보관 기간:</strong> 상담 완료 후 1년
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 단계별 안내 메시지
const StepGuidanceMessage: React.FC<{ step: number }> = ({ step }) => {
  const messages = {
    1: {
      title: '1단계: 서비스 종류',
      description: '어떤 웹사이트를 만들지 알려주세요',
      tip: '💡 비슷한 것을 선택하시면 더 정확한 견적을 드려요'
    },
    2: {
      title: '2단계: 규모와 예산',
      description: '프로젝트 크기와 예산 범위를 선택해주세요',
      tip: '💰 다른 업체 대비 50% 이상 저렴해요'
    },
    3: {
      title: '3단계: 일정과 기능',
      description: '언제까지 필요하고, 어떤 기능이 중요한지 알려주세요',
      tip: '⚡ 빠른 일정일수록 추가 비용이 있을 수 있어요'
    },
    4: {
      title: '4단계: 연락처',
      description: '상담 결과를 전달받을 연락처를 입력해주세요',
      tip: '📞 24시간 내에 연락드려요'
    }
  };

  const message = messages[step as keyof typeof messages];

  return (
    <div className="step-guidance">
      <h3 className="guidance-title">{message.title}</h3>
      <p className="guidance-description">{message.description}</p>
      <div className="guidance-tip">{message.tip}</div>
    </div>
  );
};

export default OptimizedGuidedConsultation;