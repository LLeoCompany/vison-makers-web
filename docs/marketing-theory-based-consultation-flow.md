# 마케팅 이론 기반 상담신청 플로우 설계 문서

## 📋 목차

1. [AIDA 모델 기반 랜딩 페이지 설계](#aida-모델-기반-랜딩-페이지-설계)
2. [퍼널 전략 및 이탈률 최소화](#퍼널-전략-및-이탈률-최소화)
3. [FAB 이론 적용한 서비스 소개](#fab-이론-적용한-서비스-소개)
4. [게슈탈트 시각 심리학 기반 UI 설계](#게슈탈트-시각-심리학-기반-ui-설계)
5. [행동경제학 및 심리학 기반 UX](#행동경제학-및-심리학-기반-ux)
6. [최적화된 상담신청 플로우](#최적화된-상담신청-플로우)
7. [전환율 최적화 전략](#전환율-최적화-전략)

---

## 🎯 AIDA 모델 기반 랜딩 페이지 설계

### 1. Attention (관심 끌기) - 상단 히어로 섹션

```jsx
<HeroSection>
  {/* 강력한 헤드라인 - 주의 집중 */}
  <HeadlineArea>
    <MainHeadline>
      <HighlightText>웹사이트 제작</HighlightText>
      <br />
      <PainPoint>복잡하고 비싸서 고민이세요?</PainPoint>
    </MainHeadline>

    <SubHeadline>
      <SolutionPromise>
        5분 만에 맞춤 견적을 확인하고
        <br />
        <BenefitText>합리적인 가격</BenefitText>으로 시작하세요
      </SolutionPromise>
    </SubHeadline>
  </HeadlineArea>

  {/* 시각적 임팩트 */}
  <VisualImpact>
    <AnimatedNumbers>
      <Stat>
        <Number>1,247</Number>
        <Label>제작 완료</Label>
      </Stat>
      <Stat>
        <Number>98%</Number>
        <Label>만족도</Label>
      </Stat>
      <Stat>
        <Number>24시간</Number>
        <Label>평균 응답</Label>
      </Stat>
    </AnimatedNumbers>
  </VisualImpact>

  {/* 첫 번째 CTA - 관심을 행동으로 */}
  <PrimaryCTA>
    <CtaButton size="large" variant="primary">
      <CtaIcon>💬</CtaIcon>
      지금 무료 상담 받기
      <CtaSubtext>5분이면 끝나요</CtaSubtext>
    </CtaButton>

    <TrustSignals>
      <Signal>✓ 무료 상담</Signal>
      <Signal>✓ 맞춤 견적</Signal>
      <Signal>✓ 24시간 답변</Signal>
    </TrustSignals>
  </PrimaryCTA>

  {/* 긴급성 & 한정성 */}
  <UrgencyBanner>
    <Icon>🔥</Icon>
    <Text>
      <Strong>이번 달 한정</Strong>
      신규 고객 <Highlight>30% 할인</Highlight>
      <Timer>남은 시간: 23일 14시간</Timer>
    </Text>
  </UrgencyBanner>
</HeroSection>
```

### 2. Interest (흥미 유발) - 문제 공감 & 해결책 제시

```jsx
<InterestSection>
  {/* 고객 문제점 공감 */}
  <ProblemSection>
    <SectionTitle>이런 고민 있으셨죠?</SectionTitle>

    <ProblemCards>
      <ProblemCard>
        <ProblemIcon>😰</ProblemIcon>
        <ProblemTitle>견적이 너무 비싸요</ProblemTitle>
        <ProblemDescription>
          다른 업체는 몇천만원씩...
          <br />
          우리 예산으로는 무리인가요?
        </ProblemDescription>
      </ProblemCard>

      <ProblemCard>
        <ProblemIcon>🤔</ProblemIcon>
        <ProblemTitle>뭘 해야 할지 모르겠어요</ProblemTitle>
        <ProblemDescription>
          홈페이지? 쇼핑몰? 앱?
          <br />
          우리에게 맞는 게 뭔지...
        </ProblemDescription>
      </ProblemCard>

      <ProblemCard>
        <ProblemIcon>😤</ProblemIcon>
        <ProblemTitle>업체마다 말이 달라요</ProblemTitle>
        <ProblemDescription>
          어떤 곳은 필요 없다고 하고
          <br />
          어떤 곳은 꼭 필요하다고 하고...
        </ProblemDescription>
      </ProblemCard>
    </ProblemCards>
  </ProblemSection>

  {/* 해결책 제시 */}
  <SolutionSection>
    <SolutionTitle>
      <Highlight>LeoFitTech</Highlight>는 달라요
    </SolutionTitle>

    <SolutionGrid>
      <SolutionItem>
        <SolutionIcon>💡</SolutionIcon>
        <SolutionBenefit>정직한 컨설팅</SolutionBenefit>
        <SolutionDescription>
          과도한 기능 추천 없이
          <br />
          <Strong>정말 필요한 것만</Strong> 제안드려요
        </SolutionDescription>
      </SolutionItem>

      <SolutionItem>
        <SolutionIcon>💰</SolutionIcon>
        <SolutionBenefit>합리적인 가격</SolutionBenefit>
        <SolutionDescription>
          대기업 절반 가격으로
          <br />
          <Strong>같은 품질</Strong>을 제공합니다
        </SolutionDescription>
      </SolutionItem>

      <SolutionItem>
        <SolutionIcon>⚡</SolutionIcon>
        <SolutionBenefit>빠른 대응</SolutionBenefit>
        <SolutionDescription>
          상담 신청 후<br />
          <Strong>24시간 내</Strong> 연락드려요
        </SolutionDescription>
      </SolutionItem>
    </SolutionGrid>

    {/* 두 번째 CTA - 관심을 구체적 행동으로 */}
    <SecondaryCTA>
      <CtaButton variant="secondary">우리 프로젝트 견적 받기</CtaButton>
    </SecondaryCTA>
  </SolutionSection>
</InterestSection>
```

### 3. Desire (욕구 증폭) - 사회적 증거 & 혜택 강조

```jsx
<DesireSection>
  {/* 사회적 증거 - 고객 후기 */}
  <SocialProofSection>
    <SectionTitle>고객들이 말하는 LeoFitTech</SectionTitle>

    <TestimonialSlider>
      <Testimonial>
        <CustomerInfo>
          <Avatar src="/customers/cafe-owner.jpg" />
          <CustomerDetails>
            <Name>김소영 대표</Name>
            <Company>소영카페</Company>
            <Business>카페 운영</Business>
          </CustomerDetails>
        </CustomerInfo>
        <TestimonialContent>
          "<Highlight>300만원 예산</Highlight>으로 홈페이지와 예약시스템까지
          만들어주셨어요. 덕분에 <Strong>매출이 30% 증가</Strong>했습니다!"
        </TestimonialContent>
        <Rating>★★★★★</Rating>
      </Testimonial>

      <Testimonial>
        <CustomerInfo>
          <Avatar src="/customers/clinic-director.jpg" />
          <CustomerDetails>
            <Name>박진우 원장</Name>
            <Company>미소치과</Company>
            <Business>치과 운영</Business>
          </CustomerDetails>
        </CustomerInfo>
        <TestimonialContent>
          "다른 업체는 <Highlight>2천만원</Highlight>이라고 했는데, 여기서는{" "}
          <Strong>800만원</Strong>에 더 좋은 결과를 만들어주셨어요."
        </TestimonialContent>
        <Rating>★★★★★</Rating>
      </Testimonial>
    </TestimonialSlider>
  </SocialProofSection>

  {/* 성과 지표 */}
  <AchievementSection>
    <AchievementGrid>
      <Achievement>
        <AchievementNumber>1,247</AchievementNumber>
        <AchievementLabel>프로젝트 완성</AchievementLabel>
        <AchievementPeriod>2019-2024</AchievementPeriod>
      </Achievement>

      <Achievement>
        <AchievementNumber>98%</AchievementNumber>
        <AchievementLabel>고객 만족도</AchievementLabel>
        <AchievementPeriod>5점 기준 4.9점</AchievementPeriod>
      </Achievement>

      <Achievement>
        <AchievementNumber>24시간</AchievementNumber>
        <AchievementLabel>평균 응답시간</AchievementLabel>
        <AchievementPeriod>최대 48시간</AchievementPeriod>
      </Achievement>

      <Achievement>
        <AchievementNumber>50%</AchievementNumber>
        <AchievementLabel>비용 절감</AchievementLabel>
        <AchievementPeriod>타 업체 대비</AchievementPeriod>
      </Achievement>
    </AchievementGrid>
  </AchievementSection>

  {/* 로고 월 - 신뢰도 강화 */}
  <ClientLogos>
    <LogoTitle>함께한 브랜드들</LogoTitle>
    <LogoGrid>
      <ClientLogo src="/logos/client1.png" alt="고객사1" />
      <ClientLogo src="/logos/client2.png" alt="고객사2" />
      <ClientLogo src="/logos/client3.png" alt="고객사3" />
      <ClientLogo src="/logos/client4.png" alt="고객사4" />
      <PlusMore>+200개 브랜드</PlusMore>
    </LogoGrid>
  </ClientLogos>
</DesireSection>
```

### 4. Action (행동 유도) - 강력한 CTA

```jsx
<ActionSection>
  {/* 메인 액션 영역 */}
  <FinalCTA>
    <CtaContainer>
      <CtaHeadline>
        <MainText>지금 시작하세요</MainText>
        <SubText>무료 상담으로 첫 걸음을 내딛어보세요</SubText>
      </CtaHeadline>

      {/* 두 가지 상담 옵션 - 히크의 법칙 적용 */}
      <ConsultationOptions>
        <ConsultationOption primary>
          <OptionIcon>🎯</OptionIcon>
          <OptionTitle>5분 맞춤 상담</OptionTitle>
          <OptionDescription>간단한 질문으로 바로 견적 확인</OptionDescription>
          <OptionBenefits>
            <Benefit>✓ 즉시 예상 견적</Benefit>
            <Benefit>✓ 맞춤 제안서</Benefit>
            <Benefit>✓ 5분이면 완료</Benefit>
          </OptionBenefits>
          <CtaButton size="large" variant="primary">
            맞춤 상담 받기
          </CtaButton>
        </ConsultationOption>

        <ConsultationOption>
          <OptionIcon>💬</OptionIcon>
          <OptionTitle>전화 상담</OptionTitle>
          <OptionDescription>자유롭게 상담받고 싶다면</OptionDescription>
          <OptionBenefits>
            <Benefit>✓ 전문가 직접 상담</Benefit>
            <Benefit>✓ 복잡한 요구사항 OK</Benefit>
            <Benefit>✓ 맞춤형 솔루션</Benefit>
          </OptionBenefits>
          <CtaButton size="large" variant="secondary">
            전화 상담 신청
          </CtaButton>
        </ConsultationOption>
      </ConsultationOptions>
    </CtaContainer>

    {/* 마지막 안심 요소 */}
    <TrustElements>
      <TrustElement>
        <TrustIcon>🔒</TrustIcon>
        <TrustText>개인정보 안전 보호</TrustText>
      </TrustElement>
      <TrustElement>
        <TrustIcon>💯</TrustIcon>
        <TrustText>100% 무료 상담</TrustText>
      </TrustElement>
      <TrustElement>
        <TrustIcon>⚡</TrustIcon>
        <TrustText>24시간 내 연락</TrustText>
      </TrustElement>
    </TrustElements>
  </FinalCTA>
</ActionSection>
```

---

## 🎯 퍼널 전략 및 이탈률 최소화

### 1. 퍼널 단계별 설계

```typescript
// 퍼널 단계 정의
export const FUNNEL_STAGES = {
  AWARENESS: "awareness", // 인지 - 랜딩 페이지 방문
  INTEREST: "interest", // 관심 - 스크롤, 체류시간
  CONSIDERATION: "consideration", // 고려 - CTA 클릭
  INTENT: "intent", // 의도 - 상담신청 시작
  EVALUATION: "evaluation", // 평가 - 상담신청 진행
  CONVERSION: "conversion", // 전환 - 상담신청 완료
} as const;

// 단계별 이탈 방지 전략
export const RETENTION_STRATEGIES = {
  [FUNNEL_STAGES.AWARENESS]: {
    strategy: "즉시 주의 집중",
    tactics: [
      "강력한 헤드라인 (3초 내 메시지 전달)",
      "시각적 임팩트 (애니메이션, 대비)",
      "로딩 속도 최적화 (2초 이내)",
    ],
    exitIntentPrevention: {
      trigger: "mouse-leave",
      action: "exit-intent-popup",
      message: "잠깐! 무료 견적만이라도 확인해보세요",
    },
  },

  [FUNNEL_STAGES.INTEREST]: {
    strategy: "문제 공감 및 해결책 제시",
    tactics: [
      "고객 페인포인트 구체적 표현",
      "사회적 증거 (고객 후기, 통계)",
      "스크롤 트리거 애니메이션",
    ],
    scrollTracking: {
      milestones: [25, 50, 75, 100],
      actions: ["show-sticky-cta", "highlight-benefits", "social-proof"],
    },
  },

  [FUNNEL_STAGES.CONSIDERATION]: {
    strategy: "행동 장벽 최소화",
    tactics: [
      "CTA 버튼 최적화 (크기, 색상, 위치)",
      "선택의 부담 감소 (2개 옵션만)",
      "안심 요소 강화 (무료, 빠른 응답)",
    ],
    ctaOptimization: {
      size: "large",
      color: "#FF6B35", // 주황색 - 행동 유도
      position: "sticky",
      text: "지금 무료 상담 받기",
    },
  },
};
```

### 2. 이탈률 최소화 구현

```jsx
// 이탈 방지 컴포넌트
const ExitIntentHandler = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowExitIntent(true);
        setHasShown(true);

        // 분석 이벤트
        gtag("event", "exit_intent_triggered", {
          funnel_stage: "consideration",
          time_on_page: performance.now() / 1000,
        });
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  return (
    <ExitIntentModal show={showExitIntent}>
      <ModalContent>
        <Headline>잠깐! 떠나시기 전에...</Headline>
        <Offer>
          <OfferIcon>🎁</OfferIcon>
          <OfferText>
            무료 견적서만이라도
            <br />
            <Highlight>이메일로 받아보세요</Highlight>
          </OfferText>
        </Offer>

        <QuickForm>
          <Input placeholder="이메일 주소" type="email" autoFocus />
          <SubmitButton>무료 견적서 받기</SubmitButton>
        </QuickForm>

        <BenefitList>
          <Benefit>✓ 맞춤 견적서 무료 제공</Benefit>
          <Benefit>✓ 영업 전화 없음</Benefit>
          <Benefit>✓ 언제든 취소 가능</Benefit>
        </BenefitList>
      </ModalContent>
    </ExitIntentModal>
  );
};

// 스크롤 기반 CTA 표시
const ScrollTriggeredCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;

      setScrollProgress(progress);

      // 50% 스크롤 시 sticky CTA 표시
      if (progress > 50 && !isVisible) {
        setIsVisible(true);
        gtag("event", "sticky_cta_shown", {
          scroll_percentage: progress,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  return (
    <StickyCtaContainer visible={isVisible}>
      <ProgressBar width={scrollProgress} />
      <CtaContent>
        <CtaText>
          <Strong>무료 상담</Strong> 받고 맞춤 견적 확인하세요
        </CtaText>
        <CtaButton
          onClick={() => {
            gtag("event", "sticky_cta_clicked", {
              scroll_percentage: scrollProgress,
            });
            // 상담신청 페이지로 이동
          }}
        >
          지금 신청하기
        </CtaButton>
      </CtaContent>
    </StickyCtaContainer>
  );
};
```

---

## 🏢 FAB 이론 적용한 서비스 소개

### 1. Feature → Advantage → Benefit 구조

```jsx
// 서비스별 FAB 구조 정의
const SERVICE_FAB_STRUCTURE = {
  homepage: {
    features: [
      "반응형 웹디자인",
      "SEO 최적화",
      "빠른 로딩 속도",
      "관리자 페이지",
    ],
    advantages: [
      "모든 기기에서 완벽 표시",
      "검색 엔진 상위 노출",
      "사용자 이탈률 감소",
      "직접 내용 수정 가능",
    ],
    benefits: [
      "더 많은 고객 유입",
      "매출 증대",
      "고객 만족도 향상",
      "관리 비용 절약",
    ],
  },

  shopping: {
    features: [
      "결제 시스템 연동",
      "재고 관리 시스템",
      "주문 관리 대시보드",
      "고객 관리 CRM",
    ],
    advantages: [
      "안전한 온라인 결제",
      "실시간 재고 추적",
      "주문 처리 자동화",
      "고객 데이터 분석",
    ],
    benefits: [
      "매출 채널 확대",
      "운영 효율성 증대",
      "고객 서비스 향상",
      "데이터 기반 의사결정",
    ],
  },
};

// FAB 컴포넌트
const FABSection = ({ serviceType }) => {
  const fabData = SERVICE_FAB_STRUCTURE[serviceType];

  return (
    <FABContainer>
      <SectionTitle>
        왜 <Highlight>LeoFitTech</Highlight>를 선택해야 할까요?
      </SectionTitle>

      <FABGrid>
        {fabData.features.map((feature, index) => (
          <FABCard key={index}>
            {/* Feature - 기능 */}
            <FeatureSection>
              <FeatureIcon>⚙️</FeatureIcon>
              <FeatureTitle>기능</FeatureTitle>
              <FeatureDescription>{feature}</FeatureDescription>
            </FeatureSection>

            {/* Arrow */}
            <Arrow>→</Arrow>

            {/* Advantage - 장점 */}
            <AdvantageSection>
              <AdvantageIcon>✨</AdvantageIcon>
              <AdvantageTitle>장점</AdvantageTitle>
              <AdvantageDescription>
                {fabData.advantages[index]}
              </AdvantageDescription>
            </AdvantageSection>

            {/* Arrow */}
            <Arrow>→</Arrow>

            {/* Benefit - 고객 이익 */}
            <BenefitSection>
              <BenefitIcon>🎯</BenefitIcon>
              <BenefitTitle>고객 이익</BenefitTitle>
              <BenefitDescription highlight>
                {fabData.benefits[index]}
              </BenefitDescription>
            </BenefitSection>
          </FABCard>
        ))}
      </FABGrid>
    </FABContainer>
  );
};
```

### 2. 고객 관점의 이익 중심 메시지

```jsx
// 이익 중심 메시지 컴포넌트
const BenefitFocusedMessages = () => {
  return (
    <BenefitMessagesSection>
      <MessageGrid>
        <BenefitMessage>
          <BenefitIcon>💰</BenefitIcon>
          <BenefitTitle>비용 절약</BenefitTitle>
          <BenefitDescription>
            <Feature>개발 비용 50% 절감</Feature>
            <Arrow>→</Arrow>
            <Advantage>합리적인 가격 정책</Advantage>
            <Arrow>→</Arrow>
            <Benefit>
              <Strong>연간 500만원</Strong> 마케팅 예산 확보
            </Benefit>
          </BenefitDescription>
        </BenefitMessage>

        <BenefitMessage>
          <BenefitIcon>📈</BenefitIcon>
          <BenefitTitle>매출 증대</BenefitTitle>
          <BenefitDescription>
            <Feature>SEO 최적화 + 모바일 대응</Feature>
            <Arrow>→</Arrow>
            <Advantage>검색 유입 3배 증가</Advantage>
            <Arrow>→</Arrow>
            <Benefit>
              <Strong>월 매출 30% 상승</Strong> 평균 달성
            </Benefit>
          </BenefitDescription>
        </BenefitMessage>

        <BenefitMessage>
          <BenefitIcon>⏰</BenefitIcon>
          <BenefitTitle>시간 절약</BenefitTitle>
          <BenefitDescription>
            <Feature>관리자 페이지 제공</Feature>
            <Arrow>→</Arrow>
            <Advantage>직접 내용 수정 가능</Advantage>
            <Arrow>→</Arrow>
            <Benefit>
              <Strong>월 20시간</Strong> 관리 시간 단축
            </Benefit>
          </BenefitDescription>
        </BenefitMessage>
      </MessageGrid>
    </BenefitMessagesSection>
  );
};
```

---

## 🎨 게슈탈트 시각 심리학 기반 UI 설계

### 1. 근접성 (Proximity) 원리 적용

```scss
// 관련 요소들의 시각적 그룹핑
.consultation-option-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px; // 옵션 간 충분한 간격
  margin: 60px 0; // 다른 섹션과의 분리

  .option-card {
    // 카드 내부 요소들은 밀착 배치
    .option-icon {
      margin-bottom: 8px; // 아이콘과 제목 밀착
    }

    .option-title {
      margin-bottom: 4px; // 제목과 설명 밀착
    }

    .option-description {
      margin-bottom: 16px; // 설명과 혜택 사이 적당한 간격
    }

    .option-benefits {
      .benefit-item {
        margin-bottom: 4px; // 혜택 항목들 밀착
      }
    }

    .cta-button {
      margin-top: 24px; // 버튼은 약간 분리
    }
  }
}

// 신뢰 요소들 그룹핑
.trust-signals-group {
  display: flex;
  justify-content: center;
  gap: 8px; // 신뢰 요소들은 밀착 배치
  margin-top: 40px; // 다른 요소와 분리

  .trust-signal {
    padding: 8px 16px;
    // 개별 신뢰 요소들은 하나의 덩어리로 보이도록
  }
}
```

### 2. 유사성 (Similarity) 원리 적용

```scss
// 일관된 스타일링으로 시각적 연결
.service-cards-container {
  .service-card {
    // 모든 서비스 카드는 동일한 스타일
    border-radius: 16px;
    padding: 32px;
    background: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }

    .service-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .service-title {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .service-description {
      font-size: 16px;
      color: #718096;
      line-height: 1.6;
    }
  }
}

// CTA 버튼들의 일관성
.cta-button-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: white;
  font-weight: 700;
  font-size: 18px;
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
  }
}

.cta-button-secondary {
  @extend .cta-button-primary;
  background: white;
  color: #ff6b35;
  border: 2px solid #ff6b35;

  &:hover {
    background: #ff6b35;
    color: white;
  }
}
```

### 3. 연속성 (Continuity) 원리 적용

```jsx
// 시각적 흐름을 만드는 컴포넌트
const VisualFlowSection = () => {
  return (
    <FlowContainer>
      {/* 진행 단계 시각화 */}
      <ProcessFlow>
        <FlowStep active>
          <StepNumber>1</StepNumber>
          <StepTitle>상담 신청</StepTitle>
          <StepDescription>5분 만에 완료</StepDescription>
        </FlowStep>

        <FlowConnector>
          <ConnectorLine />
          <ConnectorArrow>→</ConnectorArrow>
        </FlowConnector>

        <FlowStep>
          <StepNumber>2</StepNumber>
          <StepTitle>맞춤 제안</StepTitle>
          <StepDescription>24시간 내 연락</StepDescription>
        </FlowStep>

        <FlowConnector>
          <ConnectorLine />
          <ConnectorArrow>→</ConnectorArrow>
        </FlowConnector>

        <FlowStep>
          <StepNumber>3</StepNumber>
          <StepTitle>프로젝트 시작</StepTitle>
          <StepDescription>계약 후 즉시</StepDescription>
        </FlowStep>
      </ProcessFlow>

      {/* Z-패턴 레이아웃 */}
      <ZPatternSection>
        <TopLeft>
          <Headline>완성된 프로젝트</Headline>
        </TopLeft>

        <TopRight>
          <ProjectImage src="/portfolio/project1.jpg" />
        </TopRight>

        <BottomLeft>
          <ProjectDetails>
            • 제작 기간: 4주 • 제작 비용: 800만원 • 고객 만족도: 5/5
          </ProjectDetails>
        </BottomLeft>

        <BottomRight>
          <CtaButton>비슷한 프로젝트 견적받기</CtaButton>
        </BottomRight>
      </ZPatternSection>
    </FlowContainer>
  );
};
```

### 4. 비주얼 계층 구조 (Visual Hierarchy)

```scss
// 중요도에 따른 시각적 계층
.landing-page {
  // 1차 중요도: 메인 헤드라인
  .main-headline {
    font-size: clamp(32px, 6vw, 64px);
    font-weight: 900;
    color: #1a202c;
    line-height: 1.2;
    margin-bottom: 16px;

    .highlight-text {
      color: #ff6b35;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #ff6b35, #f7931e);
        border-radius: 2px;
      }
    }
  }

  // 2차 중요도: 서브 헤드라인
  .sub-headline {
    font-size: clamp(18px, 4vw, 28px);
    font-weight: 600;
    color: #4a5568;
    line-height: 1.4;
    margin-bottom: 32px;
  }

  // 3차 중요도: 섹션 제목
  .section-title {
    font-size: clamp(24px, 5vw, 40px);
    font-weight: 800;
    color: #2d3748;
    text-align: center;
    margin-bottom: 48px;
  }

  // 4차 중요도: 본문
  .body-text {
    font-size: 16px;
    font-weight: 400;
    color: #718096;
    line-height: 1.6;
  }

  // 5차 중요도: 캡션
  .caption-text {
    font-size: 14px;
    font-weight: 400;
    color: #a0aec0;
    line-height: 1.4;
  }
}

// 컬러 계층 구조
:root {
  // Primary Colors (최고 중요도)
  --color-primary: #ff6b35;
  --color-primary-dark: #e55a2b;

  // Secondary Colors (중요도)
  --color-secondary: #4299e1;
  --color-secondary-dark: #3182ce;

  // Neutral Colors (기본)
  --color-text-primary: #1a202c;
  --color-text-secondary: #4a5568;
  --color-text-muted: #718096;
  --color-text-subtle: #a0aec0;

  // Background Colors
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f7fafc;
  --color-bg-accent: #fff5f2;
}
```

---

## 🧠 행동경제학 및 심리학 기반 UX

### 1. 손실 회피 (Loss Aversion) 적용

```jsx
// 손실 회피 심리를 활용한 메시지
const LossAversionMessages = () => {
  return (
    <LossAversionSection>
      {/* 기회 손실 강조 */}
      <OpportunityLoss>
        <LossIcon>⚠️</LossIcon>
        <LossTitle>놓치고 있는 기회들</LossTitle>
        <LossItems>
          <LossItem>
            <LossAmount>월 300만원</LossAmount>
            <LossDescription>온라인 주문 기회 손실</LossDescription>
          </LossItem>
          <LossItem>
            <LossAmount>연 2,000만원</LossAmount>
            <LossDescription>경쟁사 대비 매출 격차</LossDescription>
          </LossItem>
          <LossItem>
            <LossAmount>고객 60%</LossAmount>
            <LossDescription>모바일 사용자 이탈</LossDescription>
          </LossItem>
        </LossItems>
      </OpportunityLoss>

      {/* 행동하지 않을 경우의 비용 */}
      <InactionCost>
        <CostTitle>
          <WarningIcon>🚨</WarningIcon>
          지금 시작하지 않으면...
        </CostTitle>
        <CostScenarios>
          <CostScenario>
            <TimeFrame>6개월 후</TimeFrame>
            <CostDescription>
              경쟁사들이 온라인 시장 선점
              <br />
              <CostAmount>-1,500만원</CostAmount> 매출 기회 상실
            </CostDescription>
          </CostScenario>
          <CostScenario>
            <TimeFrame>1년 후</TimeFrame>
            <CostDescription>
              디지털 전환 비용 2배 증가
              <br />
              <CostAmount>+3,000만원</CostAmount> 추가 비용 발생
            </CostDescription>
          </CostScenario>
        </CostScenarios>
      </InactionCost>

      {/* 즉시 행동 유도 */}
      <ImmediateAction>
        <ActionMessage>
          <ActionIcon>💡</ActionIcon>
          <ActionText>
            <Strong>지금 상담 신청</Strong>하면
            <br />이 모든 손실을 <Highlight>예방</Highlight>할 수 있습니다
          </ActionText>
        </ActionMessage>
        <ActionCTA>
          <CtaButton size="large" variant="primary">
            손실 방지하기 - 무료 상담 신청
          </CtaButton>
        </ActionCTA>
      </ImmediateAction>
    </LossAversionSection>
  );
};
```

### 2. 사회적 증거 (Social Proof) 극대화

```jsx
// 다양한 형태의 사회적 증거
const SocialProofShowcase = () => {
  const [liveStats, setLiveStats] = useState({
    consultationsToday: 23,
    projectsCompleted: 1247,
    activeUsers: 156,
  });

  return (
    <SocialProofContainer>
      {/* 실시간 활동 표시 */}
      <LiveActivity>
        <ActivityTitle>🔴 실시간 활동</ActivityTitle>
        <ActivityItems>
          <ActivityItem>
            <ActivityIcon>💬</ActivityIcon>
            <ActivityText>
              <Strong>김○○님</Strong>이 <Time>2분 전</Time> 상담 신청했습니다
            </ActivityText>
          </ActivityItem>
          <ActivityItem>
            <ActivityIcon>✅</ActivityIcon>
            <ActivityText>
              <Strong>박○○님</Strong>의 프로젝트가 <Time>1시간 전</Time>{" "}
              완료되었습니다
            </ActivityText>
          </ActivityItem>
          <ActivityItem>
            <ActivityIcon>📞</ActivityIcon>
            <ActivityText>
              오늘 <Strong>{liveStats.consultationsToday}명</Strong>이 상담
              신청했습니다
            </ActivityText>
          </ActivityItem>
        </ActivityItems>
      </LiveActivity>

      {/* 고객 성공 사례 */}
      <SuccessStories>
        <StoriesTitle>고객 성공 스토리</StoriesTitle>
        <StoriesGrid>
          <SuccessStory>
            <CustomerPhoto src="/testimonials/customer1.jpg" />
            <StoryContent>
              <CustomerName>소영카페 김소영 대표</CustomerName>
              <StoryText>
                "홈페이지 오픈 후 <Highlight>예약이 3배</Highlight> 늘었어요.
                매출도 <Highlight>30% 증가</Highlight>했습니다!"
              </StoryText>
              <StoryMetrics>
                <Metric>
                  <MetricValue>+200%</MetricValue>
                  <MetricLabel>예약 증가</MetricLabel>
                </Metric>
                <Metric>
                  <MetricValue>+30%</MetricValue>
                  <MetricLabel>매출 증가</MetricLabel>
                </Metric>
              </StoryMetrics>
            </StoryContent>
          </SuccessStory>
        </StoriesGrid>
      </SuccessStories>

      {/* 업계 전문가 추천 */}
      <ExpertEndorsement>
        <ExpertProfile>
          <ExpertPhoto src="/experts/digital-marketing-expert.jpg" />
          <ExpertInfo>
            <ExpertName>이현수</ExpertName>
            <ExpertTitle>디지털마케팅 전문가</ExpertTitle>
            <ExpertCredentials>前 네이버 마케팅팀장</ExpertCredentials>
          </ExpertInfo>
        </ExpertProfile>
        <EndorsementText>
          "LeoFitTech는 중소기업에게 가장 적합한 웹 솔루션을 제공합니다.
          <Highlight>합리적인 가격에 높은 품질</Highlight>을 원한다면 강력 추천합니다."
        </EndorsementText>
      </ExpertEndorsement>
    </SocialProofContainer>
  );
};
```

### 3. 한정성 & 긴급성 (Scarcity & Urgency)

```jsx
// 한정성과 긴급성을 활용한 컴포넌트
const ScarcityUrgencyComponent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  const [slotsLeft, setSlotsLeft] = useState(7);

  return (
    <ScarcityUrgencyContainer>
      {/* 한정 할인 타이머 */}
      <LimitedTimeOffer>
        <OfferBadge>🔥 특별 혜택</OfferBadge>
        <OfferTitle>
          이번 달 한정 <Highlight>30% 할인</Highlight>
        </OfferTitle>
        <OfferDescription>
          신규 고객 대상 특별가로 프로젝트 진행
        </OfferDescription>

        <CountdownTimer>
          <TimerTitle>남은 시간</TimerTitle>
          <TimeDisplay>
            <TimeUnit>
              <TimeValue>{timeLeft.days}</TimeValue>
              <TimeLabel>일</TimeLabel>
            </TimeUnit>
            <TimeSeparator>:</TimeSeparator>
            <TimeUnit>
              <TimeValue>{timeLeft.hours}</TimeValue>
              <TimeLabel>시간</TimeLabel>
            </TimeUnit>
            <TimeSeparator>:</TimeSeparator>
            <TimeUnit>
              <TimeValue>{timeLeft.minutes}</TimeValue>
              <TimeLabel>분</TimeLabel>
            </TimeUnit>
          </TimeDisplay>
        </CountdownTimer>
      </LimitedTimeOffer>

      {/* 남은 슬롯 표시 */}
      <AvailableSlots>
        <SlotsHeader>
          <SlotsIcon>⚡</SlotsIcon>
          <SlotsTitle>이번 달 상담 가능 슬롯</SlotsTitle>
        </SlotsHeader>

        <SlotsVisualization>
          <SlotsGrid>
            {Array.from({ length: 15 }, (_, i) => (
              <Slot
                key={i}
                filled={i < 15 - slotsLeft}
                className={i >= 15 - slotsLeft ? "available" : "taken"}
              >
                {i < 15 - slotsLeft ? "✓" : "○"}
              </Slot>
            ))}
          </SlotsGrid>
          <SlotsStatus>
            <SlotsRemaining>
              남은 슬롯: <Strong>{slotsLeft}개</Strong>
            </SlotsRemaining>
            <SlotsWarning>⚠️ 빠르게 마감되고 있습니다</SlotsWarning>
          </SlotsStatus>
        </SlotsVisualization>
      </AvailableSlots>

      {/* 즉시 행동 유도 */}
      <UrgentAction>
        <ActionMessage>
          <PulsingIcon>🚨</PulsingIcon>
          <ActionText>
            지금 신청하지 않으면
            <br />
            <Highlight>다음 달까지 대기</Highlight>하셔야 합니다
          </ActionText>
        </ActionMessage>

        <ActionButtons>
          <PrimaryAction>
            <CtaButton size="large" variant="primary">
              지금 할인가로 신청하기
            </CtaButton>
            <ActionBenefits>
              <Benefit>✓ 30% 할인 적용</Benefit>
              <Benefit>✓ 우선 진행 보장</Benefit>
              <Benefit>✓ 24시간 내 연락</Benefit>
            </ActionBenefits>
          </PrimaryAction>
        </ActionButtons>
      </UrgentAction>
    </ScarcityUrgencyContainer>
  );
};
```

### 4. 앵커링 효과 (Anchoring Effect)

```jsx
// 가격 앵커링을 활용한 비교 테이블
const PricingAnchoringTable = () => {
  return (
    <PricingContainer>
      <PricingTitle>다른 업체와 비교해보세요</PricingTitle>

      <ComparisonTable>
        <TableHeader>
          <HeaderCell></HeaderCell>
          <HeaderCell>
            <CompanyName>대형 에이전시</CompanyName>
            <CompanyType>A사</CompanyType>
          </HeaderCell>
          <HeaderCell>
            <CompanyName>중형 업체</CompanyName>
            <CompanyType>B사</CompanyType>
          </HeaderCell>
          <HeaderCell highlight>
            <CompanyName>LeoFitTech</CompanyName>
            <CompanyType>우리</CompanyType>
            <RecommendedBadge>추천</RecommendedBadge>
          </HeaderCell>
        </TableHeader>

        <TableBody>
          <TableRow>
            <RowLabel>홈페이지 제작비</RowLabel>
            <Cell>
              <Price anchor>5,000만원</Price>
              <PriceNote>초기 견적</PriceNote>
            </Cell>
            <Cell>
              <Price>2,500만원</Price>
              <PriceNote>평균 가격</PriceNote>
            </Cell>
            <Cell highlight>
              <Price discounted>800만원</Price>
              <Discount>-70% 절약</Discount>
            </Cell>
          </TableRow>

          <TableRow>
            <RowLabel>제작 기간</RowLabel>
            <Cell>3-6개월</Cell>
            <Cell>2-3개월</Cell>
            <Cell highlight>
              <Duration>4-6주</Duration>
              <FastDelivery>빠른 진행</FastDelivery>
            </Cell>
          </TableRow>

          <TableRow>
            <RowLabel>사후 관리</RowLabel>
            <Cell>
              <Support>별도 계약</Support>
              <SupportCost>월 50만원</SupportCost>
            </Cell>
            <Cell>
              <Support>6개월</Support>
              <SupportCost>유료</SupportCost>
            </Cell>
            <Cell highlight>
              <Support>1년 무료</Support>
              <SupportValue>120만원 상당</SupportValue>
            </Cell>
          </TableRow>
        </TableBody>
      </ComparisonTable>

      <SavingsCalculator>
        <CalculatorTitle>절약 계산기</CalculatorTitle>
        <SavingsAmount>
          <SavingsValue>총 4,320만원</SavingsValue>
          <SavingsDescription>타 업체 대비 절약 가능 금액</SavingsDescription>
        </SavingsAmount>
        <SavingsBreakdown>
          <SavingItem>
            <SavingCategory>제작비 절약</SavingCategory>
            <SavingAmount>4,200만원</SavingAmount>
          </SavingItem>
          <SavingItem>
            <SavingCategory>관리비 절약</SavingCategory>
            <SavingAmount>120만원/년</SavingAmount>
          </SavingItem>
        </SavingsBreakdown>
      </SavingsCalculator>
    </PricingContainer>
  );
};
```

---

## 🔄 최적화된 상담신청 플로우

### 1. 단일 목표 법칙 적용

```jsx
// 상담신청에만 집중한 랜딩 페이지
const FocusedConsultationLanding = () => {
  return (
    <LandingContainer>
      {/* 네비게이션 최소화 - 이탈 방지 */}
      <MinimalHeader>
        <Logo>LeoFitTech</Logo>
        <TrustIndicator>
          <TrustIcon>🔒</TrustIcon>
          <TrustText>보안 연결</TrustText>
        </TrustIndicator>
      </MinimalHeader>

      {/* 모든 요소가 상담신청으로 유도 */}
      <MainContent>
        <HeroSection>
          {/* AIDA의 A: Attention */}
          <AttentionGrabber>
            <MainHeadline>
              웹사이트 제작비 <Highlight>50% 절약</Highlight>하는 방법
            </MainHeadline>
            <SubHeadline>5분 상담으로 맞춤 견적을 확인하세요</SubHeadline>
          </AttentionGrabber>

          {/* 즉시 CTA */}
          <ImmediateCTA>
            <CtaButton size="hero" variant="primary">
              지금 무료 상담 받기
            </CtaButton>
            <CtaSupport>
              <SupportText>✓ 5분이면 완료 ✓ 즉시 견적 확인</SupportText>
            </CtaSupport>
          </ImmediateCTA>
        </HeroSection>

        {/* AIDA의 I: Interest - 문제 공감 */}
        <ProblemSection>
          <ProblemTitle>이런 걱정 있으셨죠?</ProblemTitle>
          <ProblemCards>
            {problems.map((problem) => (
              <ProblemCard key={problem.id}>
                <ProblemIcon>{problem.icon}</ProblemIcon>
                <ProblemText>{problem.text}</ProblemText>
              </ProblemCard>
            ))}
          </ProblemCards>

          {/* 문제 해결 CTA */}
          <ProblemSolutionCTA>
            <CtaButton variant="secondary">
              우리 상황에 맞는 해결책 알아보기
            </CtaButton>
          </ProblemSolutionCTA>
        </ProblemSection>

        {/* AIDA의 D: Desire - 욕구 증폭 */}
        <DesireSection>
          <SocialProof>
            <TestimonialSlider />
            <SuccessMetrics />
          </SocialProof>

          {/* 욕구 증폭 후 CTA */}
          <DesireCTA>
            <CtaHeadline>우리도 이런 성과를 낼 수 있을까요?</CtaHeadline>
            <CtaButton variant="primary">무료로 가능성 확인하기</CtaButton>
          </DesireCTA>
        </DesireSection>

        {/* AIDA의 A: Action - 최종 행동 유도 */}
        <ActionSection>
          <FinalCTA>
            <CtaContainer>
              <UrgencyMessage>
                <UrgencyIcon>⏰</UrgencyIcon>
                <UrgencyText>
                  이번 달 할인 혜택 <Highlight>마감 임박</Highlight>
                </UrgencyText>
              </UrgencyMessage>

              {/* 히크의 법칙 - 선택 단순화 */}
              <ConsultationChoice>
                <ChoiceOption primary>
                  <OptionIcon>🎯</OptionIcon>
                  <OptionTitle>5분 맞춤 상담</OptionTitle>
                  <OptionBenefit>즉시 견적 확인</OptionBenefit>
                  <CtaButton size="large">맞춤 상담 시작하기</CtaButton>
                </ChoiceOption>

                <ChoiceOption>
                  <OptionIcon>📞</OptionIcon>
                  <OptionTitle>전화 상담</OptionTitle>
                  <OptionBenefit>자세한 설명</OptionBenefit>
                  <CtaButton size="large" variant="secondary">
                    전화 상담 신청
                  </CtaButton>
                </ChoiceOption>
              </ConsultationChoice>

              {/* 최종 안심 요소 */}
              <FinalAssurance>
                <AssuranceItems>
                  <AssuranceItem>
                    <AssuranceIcon>🔒</AssuranceIcon>
                    <AssuranceText>개인정보 보호</AssuranceText>
                  </AssuranceItem>
                  <AssuranceItem>
                    <AssuranceIcon>💯</AssuranceIcon>
                    <AssuranceText>100% 무료</AssuranceText>
                  </AssuranceItem>
                  <AssuranceItem>
                    <AssuranceIcon>⚡</AssuranceIcon>
                    <AssuranceText>24시간 응답</AssuranceText>
                  </AssuranceItem>
                </AssuranceItems>
              </FinalAssurance>
            </CtaContainer>
          </FinalCTA>
        </ActionSection>
      </MainContent>

      {/* Sticky CTA - 스크롤 중에도 항상 접근 가능 */}
      <StickyBottomCTA>
        <StickyContent>
          <StickyMessage>지금 상담 신청하고 30% 할인받기</StickyMessage>
          <StickyButton>무료 상담 신청</StickyButton>
        </StickyContent>
      </StickyBottomCTA>
    </LandingContainer>
  );
};
```

### 2. 3-클릭 룰 적용

```typescript
// 상담신청까지 최대 3클릭으로 제한
export const CONSULTATION_FLOW_PATHS = {
  // Path 1: 즉시 상담 (1클릭)
  IMMEDIATE: {
    clicks: 1,
    path: ["홈페이지 → 상담신청 완료"],
    optimization: "hero CTA에서 바로 간단한 폼으로 이동",
  },

  // Path 2: 맞춤 상담 (2클릭)
  GUIDED: {
    clicks: 2,
    path: ["홈페이지 → 상담 유형 선택 → 상담신청 완료"],
    optimization: "유형 선택 후 바로 연락처만 입력",
  },

  // Path 3: 자세한 상담 (3클릭)
  DETAILED: {
    clicks: 3,
    path: ["홈페이지 → 서비스 정보 → 상담 유형 선택 → 상담신청 완료"],
    optimization: "최대 3단계로 제한, 각 단계 최소화",
  },
};

// 클릭 수 추적 및 최적화
export const useClickTracking = () => {
  const [clickPath, setClickPath] = useState<string[]>([]);

  const trackClick = (action: string) => {
    const newPath = [...clickPath, action];
    setClickPath(newPath);

    // 3클릭 초과 시 경고
    if (newPath.length > 3) {
      gtag("event", "excessive_clicks", {
        click_count: newPath.length,
        click_path: newPath.join(" → "),
      });
    }
  };

  return { clickPath, trackClick };
};
```

---

## 📊 전환율 최적화 전략

### 1. A/B 테스트 설계

```typescript
// CTA 버튼 A/B 테스트
export const CTA_VARIANTS = {
  CONTROL: {
    text: "상담 신청하기",
    color: "#4299E1",
    size: "medium",
  },

  VARIANT_A: {
    text: "지금 무료 상담 받기",
    color: "#FF6B35",
    size: "large",
  },

  VARIANT_B: {
    text: "5분만에 견적 확인하기",
    color: "#48BB78",
    size: "large",
  },

  VARIANT_C: {
    text: "💬 무료로 상담받기",
    color: "#FF6B35",
    size: "large",
  },
};

// 헤드라인 A/B 테스트
export const HEADLINE_VARIANTS = {
  CONTROL: "웹사이트 제작 전문 업체 LeoFitTech",

  BENEFIT_FOCUSED: "웹사이트 제작비 50% 절약하는 방법",

  PROBLEM_FOCUSED: "웹사이트 제작, 복잡하고 비싸서 고민이세요?",

  URGENCY_FOCUSED: "이번 달 한정! 웹사이트 제작 특가 이벤트",

  SOCIAL_PROOF: "1,247개 기업이 선택한 웹사이트 제작 서비스",
};

// A/B 테스트 구현
const useABTest = (testName: string, variants: Record<string, any>) => {
  const [selectedVariant, setSelectedVariant] = useState<string>("CONTROL");

  useEffect(() => {
    // 사용자 세그먼트 기반 변형 할당
    const userSegment = getUserSegment();
    const assignedVariant = assignVariant(testName, userSegment, variants);
    setSelectedVariant(assignedVariant);

    // 테스트 노출 이벤트 기록
    gtag("event", "ab_test_exposure", {
      test_name: testName,
      variant: assignedVariant,
      user_segment: userSegment,
    });
  }, [testName, variants]);

  const trackConversion = (conversionType: string) => {
    gtag("event", "ab_test_conversion", {
      test_name: testName,
      variant: selectedVariant,
      conversion_type: conversionType,
    });
  };

  return {
    variant: variants[selectedVariant],
    variantName: selectedVariant,
    trackConversion,
  };
};
```

### 2. 실시간 최적화

```typescript
// 실시간 전환율 모니터링
export const useRealTimeOptimization = () => {
  const [conversionRate, setConversionRate] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      // 실시간 전환율 조회
      const metrics = await getRealtimeMetrics();
      setConversionRate(metrics.conversionRate);

      // 전환율 기반 자동 최적화
      if (metrics.conversionRate < 2.0) {
        // 전환율이 낮을 때 개선 사항 제시
        const newRecommendations = generateOptimizationRecommendations(metrics);
        setRecommendations(newRecommendations);
      }
    }, 30000); // 30초마다 체크

    return () => clearInterval(interval);
  }, []);

  return { conversionRate, recommendations };
};

// 자동 최적화 추천 로직
const generateOptimizationRecommendations = (metrics: any): string[] => {
  const recommendations: string[] = [];

  if (metrics.bounceRate > 60) {
    recommendations.push("헤드라인 메시지 강화 필요");
    recommendations.push("로딩 속도 개선 필요");
  }

  if (metrics.ctaClickRate < 5) {
    recommendations.push("CTA 버튼 색상/크기 변경 고려");
    recommendations.push("CTA 문구 더 구체적으로 수정");
  }

  if (metrics.formAbandonmentRate > 30) {
    recommendations.push("상담신청 폼 단순화 필요");
    recommendations.push("필수 입력 항목 최소화");
  }

  return recommendations;
};
```

### 3. 마이크로카피 최적화

```typescript
// 심리학 기반 마이크로카피 데이터베이스
export const MICRO_COPY_VARIATIONS = {
  CTA_BUTTONS: {
    URGENCY: ["지금 신청하기", "오늘 마감 - 신청하기", "놓치기 전에 신청하기"],

    BENEFIT: ["무료 견적 받기", "맞춤 제안 받기", "절약 금액 확인하기"],

    SOCIAL: [
      "1,247명이 선택한 상담",
      "베스트셀러 상담받기",
      "추천 상담 신청하기",
    ],
  },

  FORM_LABELS: {
    FRIENDLY: {
      name: "어떻게 불러드릴까요?",
      phone: "연락받을 번호를 알려주세요",
      email: "결과를 받을 이메일 주소는?",
    },

    PROFESSIONAL: {
      name: "담당자 성함",
      phone: "연락처",
      email: "이메일 주소",
    },

    BENEFIT_FOCUSED: {
      name: "견적서에 기재될 담당자명",
      phone: "견적 안내받을 연락처",
      email: "맞춤 제안서 받을 이메일",
    },
  },

  ERROR_MESSAGES: {
    EMPATHETIC: {
      required: "이 정보가 있어야 더 정확한 견적을 드릴 수 있어요",
      email: "이메일 형식을 다시 확인해주세요",
      phone: "연락처 형식을 확인해주세요 (예: 010-1234-5678)",
    },

    INSTRUCTIONAL: {
      required: "필수 입력 항목입니다",
      email: "올바른 이메일 주소를 입력해주세요",
      phone: "올바른 전화번호를 입력해주세요",
    },
  },

  SUCCESS_MESSAGES: {
    CELEBRATORY: [
      "🎉 상담 신청 완료! 곧 연락드릴게요",
      "✨ 신청해주셔서 감사해요! 24시간 내 연락드립니다",
      "🚀 첫 걸음을 내디셨네요! 최고의 제안서로 보답하겠습니다",
    ],

    INFORMATIVE: [
      "상담 신청이 완료되었습니다. 24시간 내 연락드리겠습니다.",
      "신청해주신 정보로 맞춤 제안서를 준비하겠습니다.",
      "담당자가 배정되었습니다. 곧 연락드리겠습니다.",
    ],
  },
};

// 마이크로카피 개인화
const usePersonalizedMicroCopy = (userContext: any) => {
  const getMicroCopy = (type: string, context?: any) => {
    const variations = MICRO_COPY_VARIATIONS[type];

    // 사용자 컨텍스트에 따른 개인화
    if (userContext.isReturningVisitor) {
      return variations.FRIENDLY || variations[0];
    }

    if (userContext.trafficSource === "google_ads") {
      return variations.BENEFIT_FOCUSED || variations[0];
    }

    if (userContext.deviceType === "mobile") {
      return variations.SHORT || variations[0];
    }

    return variations.DEFAULT || variations[0];
  };

  return { getMicroCopy };
};
```

---

이렇게 마케팅 이론과 UX 심리학을 기반으로 상담신청 플로우를 재설계했습니다. 각 단계에서 과학적 근거를 바탕으로 사용자의 심리를 고려한 최적화 전략을 적용했습니다.

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"content": "AIDA 모델 기반 랜딩 페이지 플로우 재설계", "status": "completed", "activeForm": "AIDA 모델 기반 랜딩 페이지 플로우 재설계 완료"}, {"content": "퍼널 전략 및 이탈률 최소화 방안 수립", "status": "completed", "activeForm": "퍼널 전략 및 이탈률 최소화 방안 수립 완료"}, {"content": "FAB 이론 적용한 서비스 소개 구조 설계", "status": "completed", "activeForm": "FAB 이론 적용한 서비스 소개 구조 설계 완료"}, {"content": "게슈탈트 및 비주얼 계층 구조 적용한 UI 재설계", "status": "completed", "activeForm": "게슈탈트 및 비주얼 계층 구조 적용한 UI 재설계 완료"}, {"content": "심리학 기반 CTA 및 마이크로카피 최적화", "status": "completed", "activeForm": "심리학 기반 CTA 및 마이크로카피 최적화 완료"}]
