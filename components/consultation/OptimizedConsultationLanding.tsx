/**
 * AIDA 모델 기반 최적화된 상담신청 랜딩 페이지
 * 마케팅 이론과 UX 심리학을 적용한 고전환율 컴포넌트
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useConsultation } from "@/contexts/ConsultationContext";
import { useABTest } from "@/hooks/useABTest";
import { useRealTimeOptimization } from "@/hooks/useRealTimeOptimization";
import { ExitIntentHandler } from "./ExitIntentHandler";
import { ScrollTriggeredCTA } from "./ScrollTriggeredCTA";
import { SocialProofShowcase } from "./SocialProofShowcase";
import { ScarcityUrgencyComponent } from "./ScarcityUrgencyComponent";
// import { PricingAnchoringTable } from "./PricingAnchoringTable";

// AIDA 구조의 메인 랜딩 컴포넌트
export const OptimizedConsultationLanding: React.FC = () => {
  const router = useRouter();
  const { setTrackType } = useConsultation();
  const [isVisible, setIsVisible] = useState(false);

  // A/B 테스트 적용
  const { variant: headlineVariant } = useABTest("headline_test", {
    CONTROL: "웹사이트 제작 전문 업체 VisionMakers",
    BENEFIT_FOCUSED: "웹사이트 제작비 50% 절약하는 방법",
    PROBLEM_FOCUSED: "웹사이트 제작, 복잡하고 비싸서 고민이세요?",
    URGENCY_FOCUSED: "이번 달 한정! 웹사이트 제작 특가 이벤트",
  });

  const { variant: ctaVariant, trackConversion } = useABTest("cta_test", {
    CONTROL: "상담 신청하기",
    BENEFIT: "지금 무료 상담 받기",
    URGENCY: "5분만에 견적 확인하기",
    EMOJI: "💬 무료로 상담받기",
  });

  // 실시간 최적화
  const { conversionRate, recommendations } = useRealTimeOptimization();

  useEffect(() => {
    setIsVisible(true);

    // 페이지 로드 이벤트 추적
    gtag("event", "page_view", {
      page_title: "Consultation Landing",
      page_location: window.location.href,
      headline_variant: headlineVariant,
      cta_variant: ctaVariant,
    });
  }, []);

  const handleConsultationStart = (type: "guided" | "free") => {
    trackConversion("consultation_start");
    setTrackType(type);

    gtag("event", "consultation_start", {
      consultation_type: type,
      source: "landing_page",
    });

    if (type === "guided") {
      router.push("/consultation/guided/step-1");
    } else {
      router.push("/consultation/free");
    }
  };

  return (
    <div className="consultation-landing">
      {/* 이탈 방지 핸들러 */}
      <ExitIntentHandler />

      {/* 스크롤 기반 Sticky CTA */}
      <ScrollTriggeredCTA onConsultationStart={handleConsultationStart} />

      {/* 최소화된 헤더 */}
      <MinimalHeader />

      {/* AIDA: Attention - 히어로 섹션 */}
      <HeroSection
        headline={headlineVariant}
        ctaText={ctaVariant}
        onConsultationStart={handleConsultationStart}
        isVisible={isVisible}
      />

      {/* AIDA: Interest - 문제 공감 & 해결책 */}
      <InterestSection onConsultationStart={handleConsultationStart} />

      {/* AIDA: Desire - 욕구 증폭 */}
      <DesireSection>
        <SocialProofShowcase />
        <PricingAnchoringTable />
      </DesireSection>

      {/* AIDA: Action - 최종 행동 유도 */}
      <ActionSection onConsultationStart={handleConsultationStart}>
        <ScarcityUrgencyComponent />
      </ActionSection>

      {/* 실시간 최적화 디버깅 (개발환경에서만) */}
      {process.env.NODE_ENV === "development" && (
        <OptimizationDebugPanel
          conversionRate={conversionRate}
          recommendations={recommendations}
        />
      )}
    </div>
  );
};

// 최소화된 헤더 컴포넌트
const MinimalHeader: React.FC = () => {
  return (
    <header className="minimal-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <img src="/logo.svg" alt="VisionMakers" />
          </div>
          <div className="trust-indicator">
            <span className="trust-icon">🔒</span>
            <span className="trust-text">보안 연결</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// AIDA - Attention: 히어로 섹션
interface HeroSectionProps {
  headline: string;
  ctaText: string;
  onConsultationStart: (type: "guided" | "free") => void;
  isVisible: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  ctaText,
  onConsultationStart,
  isVisible,
}) => {
  return (
    <section className={`hero-section ${isVisible ? "animate-in" : ""}`}>
      <div className="container">
        <div className="hero-content">
          {/* 주의 집중 헤드라인 */}
          <div className="attention-grabber">
            <h1 className="main-headline">
              {headline.includes("50%") ? (
                <>
                  웹사이트 제작비 <span className="highlight">50% 절약</span>
                  하는 방법
                </>
              ) : headline.includes("고민") ? (
                <>
                  웹사이트 제작,{" "}
                  <span className="pain-point">
                    복잡하고 비싸서 고민이세요?
                  </span>
                </>
              ) : headline.includes("한정") ? (
                <>
                  <span className="urgency">이번 달 한정!</span> 웹사이트 제작
                  특가 이벤트
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="sub-headline">
              <span className="solution-promise">
                5분 만에 맞춤 견적을 확인하고
                <br />
                <span className="benefit-text">합리적인 가격</span>으로
                시작하세요
              </span>
            </p>
          </div>

          {/* 시각적 임팩트 - 성과 지표 */}
          <div className="visual-impact">
            <div className="animated-numbers">
              <div className="stat">
                <div className="number">1,247</div>
                <div className="label">제작 완료</div>
              </div>
              <div className="stat">
                <div className="number">98%</div>
                <div className="label">만족도</div>
              </div>
              <div className="stat">
                <div className="number">24시간</div>
                <div className="label">평균 응답</div>
              </div>
            </div>
          </div>

          {/* 첫 번째 CTA */}
          <div className="primary-cta">
            <button
              className="cta-button hero-cta"
              onClick={() => onConsultationStart("guided")}
            >
              <span className="cta-icon">💬</span>
              {ctaText}
              <span className="cta-subtext">5분이면 끝나요</span>
            </button>

            <div className="trust-signals">
              <span className="signal">✓ 무료 상담</span>
              <span className="signal">✓ 맞춤 견적</span>
              <span className="signal">✓ 24시간 답변</span>
            </div>
          </div>

          {/* 긴급성 & 한정성 배너 */}
          <div className="urgency-banner">
            <span className="icon">🔥</span>
            <div className="text">
              <strong>이번 달 한정</strong>
              신규 고객 <span className="highlight">30% 할인</span>
              <div className="timer">남은 시간: 23일 14시간</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// AIDA - Interest: 문제 공감 & 해결책 제시
interface InterestSectionProps {
  onConsultationStart: (type: "guided" | "free") => void;
}

const InterestSection: React.FC<InterestSectionProps> = ({
  onConsultationStart,
}) => {
  const problems = [
    {
      id: 1,
      icon: "😰",
      title: "견적이 너무 비싸요",
      description: "다른 업체는 몇천만원씩...\n우리 예산으로는 무리인가요?",
    },
    {
      id: 2,
      icon: "🤔",
      title: "뭘 해야 할지 모르겠어요",
      description: "홈페이지? 쇼핑몰? 앱?\n우리에게 맞는 게 뭔지...",
    },
    {
      id: 3,
      icon: "😤",
      title: "업체마다 말이 달라요",
      description:
        "어떤 곳은 필요 없다고 하고\n어떤 곳은 꼭 필요하다고 하고...",
    },
  ];

  const solutions = [
    {
      icon: "💡",
      benefit: "정직한 컨설팅",
      description: "과도한 기능 추천 없이\n정말 필요한 것만 제안드려요",
    },
    {
      icon: "💰",
      benefit: "합리적인 가격",
      description: "대기업 절반 가격으로\n같은 품질을 제공합니다",
    },
    {
      icon: "⚡",
      benefit: "빠른 대응",
      description: "상담 신청 후\n24시간 내 연락드려요",
    },
  ];

  return (
    <section className="interest-section">
      <div className="container">
        {/* 문제 공감 */}
        <div className="problem-section">
          <h2 className="section-title">이런 고민 있으셨죠?</h2>

          <div className="problem-cards">
            {problems.map((problem) => (
              <div key={problem.id} className="problem-card">
                <div className="problem-icon">{problem.icon}</div>
                <h3 className="problem-title">{problem.title}</h3>
                <p className="problem-description">
                  {problem.description.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="problem-solution-cta">
            <button
              className="cta-button secondary"
              onClick={() => onConsultationStart("free")}
            >
              우리 상황에 맞는 해결책 알아보기
            </button>
          </div>
        </div>

        {/* 해결책 제시 */}
        <div className="solution-section">
          <h2 className="solution-title">
            <span className="highlight">VisionMakers</span>는 달라요
          </h2>

          <div className="solution-grid">
            {solutions.map((solution, index) => (
              <div key={index} className="solution-item">
                <div className="solution-icon">{solution.icon}</div>
                <h3 className="solution-benefit">{solution.benefit}</h3>
                <p className="solution-description">
                  {solution.description.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {lineIndex === 1 ? <strong>{line}</strong> : line}
                      {lineIndex === 0 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="secondary-cta">
            <button
              className="cta-button secondary"
              onClick={() => onConsultationStart("guided")}
            >
              우리 프로젝트 견적 받기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// AIDA - Desire: 욕구 증폭 섹션
interface DesireSectionProps {
  children: React.ReactNode;
}

const DesireSection: React.FC<DesireSectionProps> = ({ children }) => {
  return (
    <section className="desire-section">
      <div className="container">{children}</div>
    </section>
  );
};

// AIDA - Action: 최종 행동 유도
interface ActionSectionProps {
  onConsultationStart: (type: "guided" | "free") => void;
  children: React.ReactNode;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  onConsultationStart,
  children,
}) => {
  return (
    <section className="action-section">
      <div className="container">
        {children}

        {/* 메인 액션 영역 */}
        <div className="final-cta">
          <div className="cta-container">
            <div className="cta-headline">
              <h2 className="main-text">지금 시작하세요</h2>
              <p className="sub-text">무료 상담으로 첫 걸음을 내딛어보세요</p>
            </div>

            {/* 히크의 법칙 - 선택 단순화 */}
            <div className="consultation-options">
              <div className="consultation-option primary">
                <div className="option-icon">🎯</div>
                <h3 className="option-title">5분 맞춤 상담</h3>
                <p className="option-description">
                  간단한 질문으로 바로 견적 확인
                </p>
                <div className="option-benefits">
                  <div className="benefit">✓ 즉시 예상 견적</div>
                  <div className="benefit">✓ 맞춤 제안서</div>
                  <div className="benefit">✓ 5분이면 완료</div>
                </div>
                <button
                  className="cta-button large primary"
                  onClick={() => onConsultationStart("guided")}
                >
                  맞춤 상담 받기
                </button>
              </div>

              <div className="consultation-option">
                <div className="option-icon">💬</div>
                <h3 className="option-title">전화 상담</h3>
                <p className="option-description">자유롭게 상담받고 싶다면</p>
                <div className="option-benefits">
                  <div className="benefit">✓ 전문가 직접 상담</div>
                  <div className="benefit">✓ 복잡한 요구사항 OK</div>
                  <div className="benefit">✓ 맞춤형 솔루션</div>
                </div>
                <button
                  className="cta-button large secondary"
                  onClick={() => onConsultationStart("free")}
                >
                  전화 상담 신청
                </button>
              </div>
            </div>

            {/* 최종 안심 요소 */}
            <div className="final-assurance">
              <div className="trust-elements">
                <div className="trust-element">
                  <span className="trust-icon">🔒</span>
                  <span className="trust-text">개인정보 안전 보호</span>
                </div>
                <div className="trust-element">
                  <span className="trust-icon">💯</span>
                  <span className="trust-text">100% 무료 상담</span>
                </div>
                <div className="trust-element">
                  <span className="trust-icon">⚡</span>
                  <span className="trust-text">24시간 내 연락</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// 최적화 디버그 패널 (개발환경용)
interface OptimizationDebugPanelProps {
  conversionRate: number;
  recommendations: string[];
}

const OptimizationDebugPanel: React.FC<OptimizationDebugPanelProps> = ({
  conversionRate,
  recommendations,
}) => {
  return (
    <div className="optimization-debug-panel">
      <h4>실시간 최적화 정보</h4>
      <p>전환율: {conversionRate.toFixed(2)}%</p>
      {recommendations.length > 0 && (
        <div>
          <h5>개선 제안:</h5>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OptimizedConsultationLanding;
