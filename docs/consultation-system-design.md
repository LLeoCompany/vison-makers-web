# LeoFitTech 상담 신청 시스템 설계 문서

## 📋 목차

1. [시스템 개요](#시스템-개요)
2. [API 설계](#api-설계)
3. [UI/UX 설계](#uiux-설계)
4. [코드 구현 설계](#코드-구현-설계)
5. [데이터베이스 스키마](#데이터베이스-스키마)
6. [에러 처리 및 검증](#에러-처리-및-검증)
7. [보안 고려사항](#보안-고려사항)
8. [성능 최적화](#성능-최적화)

---

## 🎯 시스템 개요

LeoFitTech 상담 신청 시스템은 두 가지 트랙을 제공합니다:

### 1. 가이드 상담 (Guided Consultation)

- **4단계 프로세스**: 서비스 종류 → 규모/예산 → 일정/기능 → 연락처
- **구조화된 데이터**: 명확한 선택지를 통한 정량적 정보 수집
- **자동 견적**: 입력된 정보를 바탕으로 예상 비용 및 일정 제시

### 2. 자유 상담 (Free Consultation)

- **간단한 프로세스**: 프로젝트 설명 + 연락처
- **유연한 요구사항**: 텍스트 기반의 자유로운 프로젝트 설명
- **맞춤 상담**: 복잡하거나 특수한 요구사항에 적합

---

## 🔌 API 설계

### 엔드포인트 구조

```
POST /api/consultation-submit
GET /api/consultation-status/:id
GET /api/versions
```

### 1. 상담 신청 API

#### Endpoint

```
POST /api/consultation-submit
```

#### Request Headers

```json
{
  "Content-Type": "application/json",
  "X-API-Version": "v2" // 선택사항, 기본값 v1
}
```

#### Request Body 스키마

**가이드 상담 요청:**

```typescript
interface GuidedConsultationRequest {
  type: "guided";
  serviceType: "homepage" | "shopping" | "booking" | "membership" | "other";
  projectSize: "small" | "medium" | "large";
  budget: "100-300" | "300-800" | "800-1500" | "1500+" | "consult";
  timeline: "1month" | "2-3months" | "6months" | "flexible";
  importantFeatures: Array<"mobile" | "seo" | "admin" | "payment">;
  additionalRequests?: string;
  contact: {
    name: string;
    phone: string;
    email: string;
    company?: string;
    preferredContactTime: "morning" | "afternoon" | "evening" | "anytime";
  };
}
```

**자유 상담 요청:**

```typescript
interface FreeConsultationRequest {
  type: "free";
  projectDescription: string;
  budget?: string;
  timeline?: string;
  contact: {
    name: string;
    phone: string;
    email: string;
    company?: string;
    preferredContactTime: "morning" | "afternoon" | "evening" | "anytime";
  };
}
```

#### Response 스키마

**성공 응답:**

```typescript
interface ConsultationResponse {
  success: true;
  message: string;
  data: {
    consultationId: string;
    consultationNumber: string;
    estimatedContactTime: string;
  };
}
```

**에러 응답:**

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error: {
    type: "validation" | "server" | "rate_limit";
    details?: any;
  };
}
```

### 2. 상담 상태 조회 API

#### Endpoint

```
GET /api/consultation-status/:consultationId
```

#### Response

```typescript
interface StatusResponse {
  success: true;
  data: {
    id: string;
    consultationNumber: string;
    status: "pending" | "in_progress" | "contacted" | "completed" | "cancelled";
    submittedAt: string;
    lastUpdated: string;
    assignedTo?: string;
    nextAction?: string;
  };
}
```

### 3. API 버전 관리

#### 지원 버전

- **v1**: 기본 응답 구조
- **v2**: 확장된 메타데이터 포함

#### 버전 지정 방법

1. Header: `X-API-Version: v2`
2. Query Parameter: `?version=v2`

---

## 🎨 UI/UX 설계

### 1. 전체 플로우

```
시작 페이지 (/consultation/start)
    ↓
트랙 선택 (가이드 vs 자유)
    ↓
┌─────────────────┐     ┌─────────────────┐
│   가이드 상담    │     │   자유 상담      │
│                │     │                │
│ Step 1: 서비스   │     │ 프로젝트 설명     │
│ Step 2: 규모/예산 │     │ +               │
│ Step 3: 일정/기능 │     │ 연락처 정보      │
│ Step 4: 연락처   │     │                │
└─────────────────┘     └─────────────────┘
    ↓                       ↓
완료 페이지 (감사 메시지 + 상담번호)
```

### 2. 화면별 상세 설계

#### 2.1 시작 페이지 (`/consultation/start`)

**목적**: 사용자의 상황에 맞는 트랙 선택 유도

**구성 요소**:

```jsx
<ConsultationStart>
  <Hero>
    <h1>어떤 방식으로 상담받고 싶으세요?</h1>
    <p>프로젝트에 맞는 상담 방식을 선택해주세요</p>
  </Hero>

  <TrackSelection>
    <GuidedTrackCard>
      <Icon>🎯</Icon>
      <Title>단계별 가이드 상담</Title>
      <Description>
        몇 가지 질문으로 빠르게
        <br />
        견적과 일정을 확인해보세요
      </Description>
      <Features>
        ✓ 5분 내 완료 ✓ 즉시 예상 견적 확인 ✓ 맞춤형 제안서 제공
      </Features>
      <Button primary>가이드 상담 시작</Button>
    </GuidedTrackCard>

    <FreeTrackCard>
      <Icon>💬</Icon>
      <Title>자유 상담</Title>
      <Description>
        프로젝트를 자유롭게 설명하고
        <br />
        전화로 자세히 상담받으세요
      </Description>
      <Features>
        ✓ 복잡한 요구사항 OK ✓ 맞춤형 솔루션 제안 ✓ 전문가 직접 상담
      </Features>
      <Button>자유 상담 시작</Button>
    </FreeTrackCard>
  </TrackSelection>
</ConsultationStart>
```

#### 2.2 가이드 상담 Step 1: 서비스 종류

**목적**: 제작할 웹사이트/서비스 유형 파악

```jsx
<Step1_ServiceType>
  <ProgressBar current={1} total={4} />
  <StepHeader>
    <h2>어떤 종류의 웹사이트가 필요하신가요?</h2>
    <p>가장 가까운 것을 선택해주세요</p>
  </StepHeader>

  <ServiceOptions>
    <ServiceCard value="homepage">
      <Icon>🏢</Icon>
      <Title>회사/브랜드 홈페이지</Title>
      <Description>브랜드 소개, 서비스 안내용</Description>
      <Examples>카페, 병원, 회사 소개</Examples>
    </ServiceCard>

    <ServiceCard value="shopping">
      <Icon>🛒</Icon>
      <Title>온라인 쇼핑몰</Title>
      <Description>상품을 온라인으로 판매</Description>
      <Examples>의류, 화장품, 식품</Examples>
    </ServiceCard>

    <ServiceCard value="booking">
      <Icon>📅</Icon>
      <Title>예약 시스템</Title>
      <Description>예약 접수 및 관리</Description>
      <Examples>미용실, 레스토랑, 클리닉</Examples>
    </ServiceCard>

    <ServiceCard value="membership">
      <Icon>👥</Icon>
      <Title>회원제 서비스</Title>
      <Description>로그인, 커뮤니티, 개인정보</Description>
      <Examples>학원, 피트니스, 동호회</Examples>
    </ServiceCard>

    <ServiceCard value="other">
      <Icon>💡</Icon>
      <Title>기타/특수 요구사항</Title>
      <Description>전화로 함께 알아보기</Description>
      <Examples>맞춤형 솔루션</Examples>
    </ServiceCard>
  </ServiceOptions>

  <Navigation>
    <Button variant="text" onClick={goBack}>
      이전
    </Button>
    <Button primary disabled={!selectedService} onClick={nextStep}>
      다음 단계
    </Button>
  </Navigation>
</Step1_ServiceType>
```

#### 2.3 가이드 상담 Step 2: 규모와 예산

```jsx
<Step2_SizeAndBudget>
  <ProgressBar current={2} total={4} />
  <StepHeader>
    <h2>프로젝트 규모와 예산을 알려주세요</h2>
  </StepHeader>

  <SectionGroup>
    <Section>
      <SectionTitle>프로젝트 규모</SectionTitle>
      <SizeOptions>
        <SizeCard value="small">
          <Title>간단하게</Title>
          <Description>5-10 페이지 정도</Description>
          <Examples>기본 소개, 연락처</Examples>
        </SizeCard>
        <SizeCard value="medium">
          <Title>보통 규모</Title>
          <Description>10-20 페이지</Description>
          <Examples>상품목록, 갤러리, 블로그</Examples>
        </SizeCard>
        <SizeCard value="large">
          <Title>큰 규모</Title>
          <Description>20페이지 이상</Description>
          <Examples>복잡한 기능, 관리자 페이지</Examples>
        </SizeCard>
      </SizeOptions>
    </Section>

    <Section>
      <SectionTitle>예산 범위</SectionTitle>
      <BudgetOptions>
        <BudgetCard value="100-300">
          <Amount>100~300만원</Amount>
          <Suitable>간단한 홈페이지</Suitable>
        </BudgetCard>
        <BudgetCard value="300-800">
          <Amount>300~800만원</Amount>
          <Suitable>기능이 있는 사이트</Suitable>
        </BudgetCard>
        <BudgetCard value="800-1500">
          <Amount>800~1500만원</Amount>
          <Suitable>복잡한 시스템</Suitable>
        </BudgetCard>
        <BudgetCard value="1500+">
          <Amount>1500만원 이상</Amount>
          <Suitable>대규모 프로젝트</Suitable>
        </BudgetCard>
        <BudgetCard value="consult">
          <Amount>상담받고 결정</Amount>
          <Suitable>예산을 잘 모르겠어요</Suitable>
        </BudgetCard>
      </BudgetOptions>
    </Section>
  </SectionGroup>

  <Navigation>
    <Button variant="text" onClick={prevStep}>
      이전
    </Button>
    <Button primary disabled={!projectSize || !budget} onClick={nextStep}>
      다음 단계
    </Button>
  </Navigation>
</Step2_SizeAndBudget>
```

#### 2.4 가이드 상담 Step 3: 일정과 중요 기능

```jsx
<Step3_TimelineAndFeatures>
  <ProgressBar current={3} total={4} />
  <StepHeader>
    <h2>일정과 중요한 기능을 선택해주세요</h2>
  </StepHeader>

  <SectionGroup>
    <Section>
      <SectionTitle>원하는 완료 시기</SectionTitle>
      <TimelineOptions>
        <TimelineCard value="1month">
          <Icon>⚡</Icon>
          <Title>1개월 이내</Title>
          <Subtitle>급해요!</Subtitle>
        </TimelineCard>
        <TimelineCard value="2-3months">
          <Icon>⏰</Icon>
          <Title>2-3개월 정도</Title>
          <Subtitle>적당히</Subtitle>
        </TimelineCard>
        <TimelineCard value="6months">
          <Icon>🌱</Icon>
          <Title>6개월 이내</Title>
          <Subtitle>여유있게</Subtitle>
        </TimelineCard>
        <TimelineCard value="flexible">
          <Icon>🤷</Icon>
          <Title>일정은 상관없어요</Title>
          <Subtitle>품질 우선</Subtitle>
        </TimelineCard>
      </TimelineOptions>
    </Section>

    <Section>
      <SectionTitle>중요하게 생각하는 기능 (복수 선택 가능)</SectionTitle>
      <FeatureOptions>
        <FeatureCard value="mobile">
          <Icon>📱</Icon>
          <Title>모바일 최적화</Title>
          <Description>모바일에서 잘 보이게</Description>
        </FeatureCard>
        <FeatureCard value="seo">
          <Icon>🔍</Icon>
          <Title>검색엔진 최적화</Title>
          <Description>네이버/구글 검색 잘 되게</Description>
        </FeatureCard>
        <FeatureCard value="admin">
          <Icon>⚙️</Icon>
          <Title>관리자 페이지</Title>
          <Description>내용을 쉽게 수정</Description>
        </FeatureCard>
        <FeatureCard value="payment">
          <Icon>💳</Icon>
          <Title>결제 시스템</Title>
          <Description>온라인 결제 기능</Description>
        </FeatureCard>
      </FeatureOptions>
    </Section>

    <Section>
      <SectionTitle>추가 요청사항 (선택사항)</SectionTitle>
      <Textarea
        placeholder="특별히 원하는 기능이나 디자인, 참고할 사이트가 있다면 알려주세요"
        value={additionalRequests}
        onChange={setAdditionalRequests}
        maxLength={500}
      />
      <CharacterCount>{additionalRequests.length}/500</CharacterCount>
    </Section>
  </SectionGroup>

  <Navigation>
    <Button variant="text" onClick={prevStep}>
      이전
    </Button>
    <Button primary disabled={!timeline} onClick={nextStep}>
      다음 단계
    </Button>
  </Navigation>
</Step3_TimelineAndFeatures>
```

#### 2.5 가이드 상담 Step 4: 연락처 정보

```jsx
<Step4_Contact>
  <ProgressBar current={4} total={4} />
  <StepHeader>
    <h2>연락처를 입력해주세요</h2>
    <p>입력해주신 정보로 상담 결과를 안내드릴게요</p>
  </StepHeader>

  <ContactForm>
    <FormGroup>
      <Label required>이름</Label>
      <Input
        type="text"
        placeholder="홍길동"
        value={contact.name}
        onChange={(e) => setContact({ ...contact, name: e.target.value })}
        required
      />
    </FormGroup>

    <FormGroup>
      <Label required>연락처</Label>
      <Input
        type="tel"
        placeholder="010-1234-5678"
        value={contact.phone}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        required
      />
    </FormGroup>

    <FormGroup>
      <Label required>이메일</Label>
      <Input
        type="email"
        placeholder="example@email.com"
        value={contact.email}
        onChange={(e) => setContact({ ...contact, email: e.target.value })}
        required
      />
    </FormGroup>

    <FormGroup>
      <Label>회사명 (선택사항)</Label>
      <Input
        type="text"
        placeholder="(주)회사명"
        value={contact.company}
        onChange={(e) => setContact({ ...contact, company: e.target.value })}
      />
    </FormGroup>

    <FormGroup>
      <Label required>연락받기 편한 시간</Label>
      <ContactTimeOptions>
        <ContactTimeCard value="morning">
          <Icon>🌅</Icon>
          <Title>평일 오전</Title>
          <Time>9시-12시</Time>
        </ContactTimeCard>
        <ContactTimeCard value="afternoon">
          <Icon>☀️</Icon>
          <Title>평일 오후</Title>
          <Time>1시-6시</Time>
        </ContactTimeCard>
        <ContactTimeCard value="evening">
          <Icon>🌆</Icon>
          <Title>평일 저녁</Title>
          <Time>6시-8시</Time>
        </ContactTimeCard>
        <ContactTimeCard value="anytime">
          <Icon>⏰</Icon>
          <Title>언제든</Title>
          <Time>괜찮아요</Time>
        </ContactTimeCard>
      </ContactTimeOptions>
    </FormGroup>
  </ContactForm>

  <Agreement>
    <Checkbox checked={agreedToTerms} onChange={setAgreedToTerms} required />
    <Label>
      개인정보 수집 및 이용에 동의합니다.
      <Link href="/privacy">자세히 보기</Link>
    </Label>
  </Agreement>

  <Navigation>
    <Button variant="text" onClick={prevStep}>
      이전
    </Button>
    <Button
      primary
      disabled={!canSubmit || isSubmitting}
      onClick={handleSubmit}
      loading={isSubmitting}
    >
      상담 신청 완료
    </Button>
  </Navigation>
</Step4_Contact>
```

#### 2.6 자유 상담 페이지

```jsx
<FreeConsultation>
  <Header>
    <h1>자유 상담</h1>
    <p>프로젝트에 대해 자유롭게 설명해주세요</p>
  </Header>

  <ConsultationForm>
    <Section>
      <SectionTitle required>프로젝트 설명</SectionTitle>
      <Textarea
        placeholder="어떤 웹사이트/서비스를 만들고 싶으신지 자유롭게 설명해주세요.
예)
- 온라인 쇼핑몰을 만들고 싶어요
- 회원가입/로그인이 있는 커뮤니티 사이트
- 예약 시스템이 있는 병원 홈페이지
- 참고할 사이트: www.example.com"
        value={projectDescription}
        onChange={setProjectDescription}
        minLength={20}
        maxLength={2000}
        rows={8}
        required
      />
      <CharacterCount>{projectDescription.length}/2000</CharacterCount>
      <HelpText>최소 20자 이상 입력해주세요</HelpText>
    </Section>

    <OptionalSection>
      <SectionTitle>추가 정보 (선택사항)</SectionTitle>

      <FormGroup>
        <Label>예상 예산</Label>
        <Input
          type="text"
          placeholder="예) 500만원 정도, 1000만원 이하"
          value={budget}
          onChange={setBudget}
        />
      </FormGroup>

      <FormGroup>
        <Label>희망 일정</Label>
        <Input
          type="text"
          placeholder="예) 3개월 이내, 연말까지"
          value={timeline}
          onChange={setTimeline}
        />
      </FormGroup>
    </OptionalSection>

    <ContactSection>
      <SectionTitle required>연락처 정보</SectionTitle>

      <ContactGrid>
        <FormGroup>
          <Label required>이름</Label>
          <Input
            type="text"
            placeholder="홍길동"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label required>연락처</Label>
          <Input
            type="tel"
            placeholder="010-1234-5678"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup span={2}>
          <Label required>이메일</Label>
          <Input
            type="email"
            placeholder="example@email.com"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            required
          />
        </FormGroup>

        <FormGroup span={2}>
          <Label>회사명 (선택사항)</Label>
          <Input
            type="text"
            placeholder="(주)회사명"
            value={contact.company}
            onChange={(e) =>
              setContact({ ...contact, company: e.target.value })
            }
          />
        </FormGroup>
      </ContactGrid>

      <FormGroup>
        <Label required>연락받기 편한 시간</Label>
        <ContactTimeGrid>
          {/* ContactTime 카드들 - 가이드 상담과 동일 */}
        </ContactTimeGrid>
      </FormGroup>
    </ContactSection>

    <Agreement>
      <Checkbox checked={agreedToTerms} onChange={setAgreedToTerms} required />
      <Label>
        개인정보 수집 및 이용에 동의합니다.
        <Link href="/privacy">자세히 보기</Link>
      </Label>
    </Agreement>

    <SubmitSection>
      <Button
        primary
        size="large"
        disabled={!canSubmit || isSubmitting}
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        상담 신청하기
      </Button>
      <HelpText>신청 후 24시간 이내 연락드립니다</HelpText>
    </SubmitSection>
  </ConsultationForm>
</FreeConsultation>
```

#### 2.7 완료 페이지

```jsx
<ConsultationComplete>
  <SuccessIcon>✅</SuccessIcon>
  <Title>상담 신청이 완료되었습니다!</Title>

  <ConsultationInfo>
    <InfoCard>
      <Label>상담 번호</Label>
      <Value copyable>{consultationNumber}</Value>
    </InfoCard>

    <InfoCard>
      <Label>신청 일시</Label>
      <Value>{submittedAt}</Value>
    </InfoCard>

    <InfoCard>
      <Label>예상 연락 시간</Label>
      <Value>{estimatedContactTime}</Value>
    </InfoCard>
  </ConsultationInfo>

  <NextSteps>
    <StepItem>
      <StepNumber>1</StepNumber>
      <StepContent>
        <StepTitle>신청 접수 완료</StepTitle>
        <StepDescription>고객님의 상담 신청을 접수했습니다</StepDescription>
      </StepContent>
      <StepStatus completed>✓</StepStatus>
    </StepItem>

    <StepItem>
      <StepNumber>2</StepNumber>
      <StepContent>
        <StepTitle>상담 준비</StepTitle>
        <StepDescription>
          담당자가 프로젝트를 검토하고 상담을 준비합니다
        </StepDescription>
      </StepContent>
      <StepStatus current>📋</StepStatus>
    </StepItem>

    <StepItem>
      <StepNumber>3</StepNumber>
      <StepContent>
        <StepTitle>전화 상담</StepTitle>
        <StepDescription>
          선택하신 시간에 전화로 상세 상담을 진행합니다
        </StepDescription>
      </StepContent>
      <StepStatus>📞</StepStatus>
    </StepItem>

    <StepItem>
      <StepNumber>4</StepNumber>
      <StepContent>
        <StepTitle>제안서 발송</StepTitle>
        <StepDescription>
          상담 결과를 바탕으로 맞춤 제안서를 보내드립니다
        </StepDescription>
      </StepContent>
      <StepStatus>📋</StepStatus>
    </StepItem>
  </NextSteps>

  <ContactInfo>
    <Title>문의사항이 있으시면</Title>
    <ContactMethods>
      <ContactMethod>
        <Icon>📞</Icon>
        <Label>전화</Label>
        <Value>02-1234-5678</Value>
      </ContactMethod>
      <ContactMethod>
        <Icon>✉️</Icon>
        <Label>이메일</Label>
        <Value>contact@LeoFitTech.co.kr</Value>
      </ContactMethod>
    </ContactMethods>
  </ContactInfo>

  <Actions>
    <Button variant="outline" onClick={() => router.push("/")}>
      홈으로 돌아가기
    </Button>
    <Button primary onClick={() => router.push("/portfolio")}>
      포트폴리오 보기
    </Button>
  </Actions>
</ConsultationComplete>
```

### 3. 반응형 디자인 가이드라인

#### 브레이크포인트

```scss
$breakpoints: (
  mobile: 480px,
  tablet: 768px,
  desktop: 1024px,
  wide: 1440px,
);
```

#### 모바일 우선 설계

- **모바일 (< 768px)**: 1열 레이아웃, 스택형 카드
- **태블릿 (768px-1024px)**: 2열 레이아웃, 적당한 여백
- **데스크톱 (> 1024px)**: 3-4열 레이아웃, 넉넉한 여백

#### 터치 친화적 인터페이스

- 최소 터치 영역: 44px × 44px
- 버튼 간 최소 간격: 8px
- 스와이프 제스처 지원

---

## 💻 코드 구현 설계

### 1. 프로젝트 구조

```
src/
├── components/
│   └── consultation/
│       ├── ConsultationStart.tsx
│       ├── GuidedConsultation/
│       │   ├── Step1ServiceType.tsx
│       │   ├── Step2SizeAndBudget.tsx
│       │   ├── Step3TimelineAndFeatures.tsx
│       │   └── Step4Contact.tsx
│       ├── FreeConsultation.tsx
│       ├── ConsultationComplete.tsx
│       └── shared/
│           ├── ProgressBar.tsx
│           ├── ServiceCard.tsx
│           ├── ContactForm.tsx
│           └── Navigation.tsx
├── contexts/
│   └── ConsultationContext.tsx
├── hooks/
│   ├── useConsultation.ts
│   ├── useConsultationSubmit.ts
│   └── useLocalStorage.ts
├── types/
│   └── consultation.ts
├── utils/
│   ├── consultation.ts
│   ├── validation.ts
│   └── api.ts
├── pages/
│   ├── consultation/
│   │   ├── start.tsx
│   │   ├── guided/
│   │   │   └── [step].tsx
│   │   ├── free.tsx
│   │   └── complete.tsx
│   └── api/
│       ├── consultation-submit.ts
│       └── consultation-status.ts
└── styles/
    └── consultation.scss
```

### 2. 핵심 컴포넌트 구현

#### 2.1 ConsultationContext (상태 관리)

```typescript
// contexts/ConsultationContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from "react";

interface ConsultationState {
  trackType: "guided" | "free" | null;
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  error: string | null;

  guided: {
    serviceType: ServiceType | null;
    projectSize: ProjectSize | null;
    budget: Budget | null;
    timeline: Timeline | null;
    importantFeatures: ImportantFeature[];
    additionalRequests: string;
    contact: Partial<ContactInfo>;
  };

  free: {
    projectDescription: string;
    budget?: string;
    timeline?: string;
    contact: Partial<ContactInfo>;
  };
}

type ConsultationAction =
  | { type: "SET_TRACK_TYPE"; payload: "guided" | "free" }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
// ... 기타 액션들

const consultationReducer = (
  state: ConsultationState,
  action: ConsultationAction
): ConsultationState => {
  switch (action.type) {
    case "SET_TRACK_TYPE":
      return {
        ...state,
        trackType: action.payload,
        totalSteps: action.payload === "guided" ? 4 : 1,
        currentStep: 1,
      };
    // ... 기타 케이스들
  }
};

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(consultationReducer, initialState);

  // 로컬 스토리지 자동 저장/복원
  useEffect(() => {
    const saved = localStorage.getItem("consultation_state");
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        dispatch({ type: "LOAD_FROM_STORAGE", payload: parsedState });
      } catch (error) {
        console.warn("Failed to load consultation state:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (state.trackType) {
      localStorage.setItem("consultation_state", JSON.stringify(state));
    }
  }, [state]);

  const value = {
    state,
    dispatch,
    // Helper methods
    setTrackType: (type: "guided" | "free") =>
      dispatch({ type: "SET_TRACK_TYPE", payload: type }),
    nextStep: () => {
      if (state.currentStep < state.totalSteps) {
        dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep + 1 });
      }
    },
    prevStep: () => {
      if (state.currentStep > 1) {
        dispatch({ type: "SET_CURRENT_STEP", payload: state.currentStep - 1 });
      }
    },
    resetState: () => {
      localStorage.removeItem("consultation_state");
      dispatch({ type: "RESET_STATE" });
    },
  };

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error("useConsultation must be used within ConsultationProvider");
  }
  return context;
};
```

#### 2.2 상담 신청 훅

```typescript
// hooks/useConsultationSubmit.ts
import { useState } from "react";
import { useRouter } from "next/router";
import {
  ConsultationRequest,
  ConsultationResponse,
} from "@/types/consultation";

export const useConsultationSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submitConsultation = async (
    data: ConsultationRequest
  ): Promise<ConsultationResponse | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/consultation-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Version": "v2",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "상담 신청 중 오류가 발생했습니다.");
      }

      // 성공 시 완료 페이지로 이동
      router.push({
        pathname: "/consultation/complete",
        query: {
          consultationId: result.data.consultationId,
          consultationNumber: result.data.consultationNumber,
        },
      });

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitConsultation,
    isSubmitting,
    error,
    clearError: () => setError(null),
  };
};
```

#### 2.3 공통 UI 컴포넌트

```typescript
// components/consultation/shared/ProgressBar.tsx
interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  className,
}) => {
  const progress = (current / total) * 100;

  return (
    <div className={`progress-bar ${className}`}>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-bar__label">
        {current} / {total}
      </div>
    </div>
  );
};
```

```typescript
// components/consultation/shared/ServiceCard.tsx
interface ServiceCardProps {
  value: string;
  icon: string;
  title: string;
  description: string;
  examples?: string;
  selected?: boolean;
  onClick: (value: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  value,
  icon,
  title,
  description,
  examples,
  selected,
  onClick,
}) => {
  return (
    <div
      className={`service-card ${selected ? "service-card--selected" : ""}`}
      onClick={() => onClick(value)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(value);
        }
      }}
    >
      <div className="service-card__icon">{icon}</div>
      <h3 className="service-card__title">{title}</h3>
      <p className="service-card__description">{description}</p>
      {examples && (
        <div className="service-card__examples">예시: {examples}</div>
      )}
      {selected && <div className="service-card__check">✓</div>}
    </div>
  );
};
```

#### 2.4 유효성 검증

```typescript
// utils/validation.ts
import { z } from "zod";

// 연락처 정보 스키마
const ContactInfoSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(50, "이름은 50자 이하로 입력해주세요"),
  phone: z
    .string()
    .regex(/^010-?\d{4}-?\d{4}$/, "올바른 휴대폰 번호를 입력해주세요"),
  email: z
    .string()
    .email("올바른 이메일 주소를 입력해주세요")
    .max(100, "이메일은 100자 이하로 입력해주세요"),
  company: z.string().max(100, "회사명은 100자 이하로 입력해주세요").optional(),
  preferredContactTime: z.enum(["morning", "afternoon", "evening", "anytime"]),
});

// 가이드 상담 스키마
const GuidedConsultationSchema = z.object({
  type: z.literal("guided"),
  serviceType: z.enum([
    "homepage",
    "shopping",
    "booking",
    "membership",
    "other",
  ]),
  projectSize: z.enum(["small", "medium", "large"]),
  budget: z.enum(["100-300", "300-800", "800-1500", "1500+", "consult"]),
  timeline: z.enum(["1month", "2-3months", "6months", "flexible"]),
  importantFeatures: z.array(z.enum(["mobile", "seo", "admin", "payment"])),
  additionalRequests: z
    .string()
    .max(500, "추가 요청사항은 500자 이하로 입력해주세요")
    .optional(),
  contact: ContactInfoSchema,
});

// 자유 상담 스키마
const FreeConsultationSchema = z.object({
  type: z.literal("free"),
  projectDescription: z
    .string()
    .min(20, "프로젝트 설명을 20자 이상 입력해주세요")
    .max(2000, "프로젝트 설명은 2000자 이하로 입력해주세요"),
  budget: z.string().max(100, "예산은 100자 이하로 입력해주세요").optional(),
  timeline: z.string().max(100, "일정은 100자 이하로 입력해주세요").optional(),
  contact: ContactInfoSchema,
});

// 통합 스키마
export const ConsultationRequestSchema = z.discriminatedUnion("type", [
  GuidedConsultationSchema,
  FreeConsultationSchema,
]);

// 실시간 유효성 검증 함수들
export const validateStep = (step: number, data: any): string[] => {
  const errors: string[] = [];

  switch (step) {
    case 1: // 서비스 타입
      if (!data.serviceType) {
        errors.push("서비스 종류를 선택해주세요");
      }
      break;

    case 2: // 규모와 예산
      if (!data.projectSize) {
        errors.push("프로젝트 규모를 선택해주세요");
      }
      if (!data.budget) {
        errors.push("예산 범위를 선택해주세요");
      }
      break;

    case 3: // 일정과 기능
      if (!data.timeline) {
        errors.push("원하는 완료 시기를 선택해주세요");
      }
      break;

    case 4: // 연락처
      try {
        ContactInfoSchema.parse(data.contact);
      } catch (err) {
        if (err instanceof z.ZodError) {
          errors.push(...err.errors.map((e) => e.message));
        }
      }
      break;
  }

  return errors;
};

// 입력값 sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // XSS 방지
    .replace(/[<>'"]/g, ""); // HTML 태그 제거
};
```

### 3. API 구현

#### 3.1 상담 신청 API

```typescript
// pages/api/consultation-submit.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ConsultationRequestSchema, sanitizeInput } from "@/utils/validation";
import { supabaseAdmin } from "@/lib/supabase";
import { generateConsultationNumber, getClientIP } from "@/utils/helpers";
import { sendNotificationEmail } from "@/lib/email";
import { logEvent } from "@/lib/analytics";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: any;
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  // CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Version");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      error: { type: "method_not_allowed" },
    });
  }

  try {
    // 1. 요청 데이터 검증
    const validationResult = ConsultationRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "입력 데이터가 유효하지 않습니다.",
        error: {
          type: "validation",
          details: validationResult.error.errors,
        },
      });
    }

    const consultationData = validationResult.data;

    // 2. 메타데이터 수집
    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = getClientIP(req);
    const referrer = req.headers.referer || "";
    const consultationNumber = generateConsultationNumber();

    // 3. 메인 상담 레코드 생성
    const { data: consultation, error: consultationError } = await supabaseAdmin
      .from("consultations")
      .insert({
        consultation_number: consultationNumber,
        type: consultationData.type,
        status: "pending",
        priority: "normal",
        contact_name: sanitizeInput(consultationData.contact.name),
        contact_phone: sanitizeInput(consultationData.contact.phone),
        contact_email: sanitizeInput(consultationData.contact.email),
        contact_company: consultationData.contact.company
          ? sanitizeInput(consultationData.contact.company)
          : null,
        preferred_contact_time: consultationData.contact.preferredContactTime,
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer_url: referrer,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (consultationError) {
      console.error("Database error:", consultationError);
      return res.status(500).json({
        success: false,
        message: "상담 신청 처리 중 오류가 발생했습니다.",
        error: { type: "server" },
      });
    }

    // 4. 타입별 세부 정보 저장
    if (consultationData.type === "guided") {
      const { error: guidedError } = await supabaseAdmin
        .from("guided_consultations")
        .insert({
          consultation_id: consultation.id,
          service_type: consultationData.serviceType,
          project_size: consultationData.projectSize,
          budget: consultationData.budget,
          timeline: consultationData.timeline,
          important_features: consultationData.importantFeatures,
          additional_requests: consultationData.additionalRequests
            ? sanitizeInput(consultationData.additionalRequests)
            : null,
        });

      if (guidedError) {
        // 메인 레코드 롤백
        await supabaseAdmin
          .from("consultations")
          .delete()
          .eq("id", consultation.id);

        console.error("Guided consultation error:", guidedError);
        return res.status(500).json({
          success: false,
          message: "가이드 상담 정보 저장 중 오류가 발생했습니다.",
          error: { type: "server" },
        });
      }
    } else {
      const { error: freeError } = await supabaseAdmin
        .from("free_consultations")
        .insert({
          consultation_id: consultation.id,
          project_description: sanitizeInput(
            consultationData.projectDescription
          ),
          budget_range: consultationData.budget
            ? sanitizeInput(consultationData.budget)
            : null,
          timeline_preference: consultationData.timeline
            ? sanitizeInput(consultationData.timeline)
            : null,
        });

      if (freeError) {
        // 메인 레코드 롤백
        await supabaseAdmin
          .from("consultations")
          .delete()
          .eq("id", consultation.id);

        console.error("Free consultation error:", freeError);
        return res.status(500).json({
          success: false,
          message: "자유 상담 정보 저장 중 오류가 발생했습니다.",
          error: { type: "server" },
        });
      }
    }

    // 5. 알림 이메일 발송 (비동기)
    try {
      await sendNotificationEmail({
        type: "new_consultation",
        consultationNumber,
        consultationType: consultationData.type,
        customerName: consultationData.contact.name,
        customerEmail: consultationData.contact.email,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // 이메일 실패는 전체 프로세스를 중단시키지 않음
    }

    // 6. 분석 이벤트 로깅
    logEvent("consultation_submitted", {
      consultation_id: consultation.id,
      consultation_type: consultationData.type,
      service_type:
        consultationData.type === "guided"
          ? consultationData.serviceType
          : "free",
      user_agent: userAgent,
      ip_address: ipAddress,
    });

    // 7. 예상 연락 시간 계산
    const estimatedContactTime =
      consultationData.type === "guided" ? "24시간 이내" : "48시간 이내";

    // 8. 성공 응답
    const responseData = {
      consultationId: consultation.id,
      consultationNumber: consultation.consultation_number,
      estimatedContactTime,
    };

    // API 버전별 응답 처리
    const apiVersion = req.headers["x-api-version"] || "v1";

    if (apiVersion === "v2") {
      return res.status(201).json({
        success: true,
        message: "상담 신청이 완료되었습니다.",
        data: responseData,
        meta: {
          version: "v2",
          submittedAt: new Date().toISOString(),
        },
      });
    } else {
      return res.status(201).json({
        success: true,
        message: "상담 신청이 완료되었습니다.",
        ...responseData,
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);

    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { type: "server" },
    });
  }
}
```

#### 3.2 상담 상태 조회 API

```typescript
// pages/api/consultation-status/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "유효하지 않은 상담 ID입니다.",
    });
  }

  try {
    const { data: consultation, error } = await supabaseAdmin
      .from("consultations")
      .select(
        `
        id,
        consultation_number,
        status,
        created_at,
        updated_at,
        assigned_to,
        contact_name,
        contact_email,
        contact_phone
      `
      )
      .eq("id", id)
      .single();

    if (error || !consultation) {
      return res.status(404).json({
        success: false,
        message: "상담 정보를 찾을 수 없습니다.",
      });
    }

    // 다음 액션 메시지 생성
    const getNextAction = (status: string) => {
      switch (status) {
        case "pending":
          return "담당자 배정 대기 중";
        case "in_progress":
          return "상담 준비 중";
        case "contacted":
          return "고객 연락 완료";
        case "completed":
          return "상담 완료";
        case "cancelled":
          return "상담 취소됨";
        default:
          return "상태 확인 중";
      }
    };

    return res.status(200).json({
      success: true,
      data: {
        id: consultation.id,
        consultationNumber: consultation.consultation_number,
        status: consultation.status,
        submittedAt: consultation.created_at,
        lastUpdated: consultation.updated_at,
        assignedTo: consultation.assigned_to,
        nextAction: getNextAction(consultation.status),
      },
    });
  } catch (error) {
    console.error("Status check error:", error);

    return res.status(500).json({
      success: false,
      message: "상태 조회 중 오류가 발생했습니다.",
    });
  }
}
```

### 4. 유틸리티 함수들

```typescript
// utils/consultation.ts

// 상담 번호 생성 (VM + YYMMDD + 4자리 시퀀스)
export const generateConsultationNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const sequence = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");

  return `VM${year}${month}${day}${sequence}`;
};

// 클라이언트 IP 추출
export const getClientIP = (req: NextApiRequest): string => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(",")[0]
    : req.connection.remoteAddress;

  return ip || "unknown";
};

// User Agent 파싱
export const parseUserAgent = (userAgent: string) => {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  const browser =
    userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/i)?.[1] || "Unknown";

  return {
    isMobile,
    browser,
    raw: userAgent,
  };
};

// UTM 파라미터 추출
export const extractUTMParams = (referrer: string) => {
  try {
    const url = new URL(referrer);
    return {
      source: url.searchParams.get("utm_source"),
      medium: url.searchParams.get("utm_medium"),
      campaign: url.searchParams.get("utm_campaign"),
      term: url.searchParams.get("utm_term"),
      content: url.searchParams.get("utm_content"),
    };
  } catch {
    return {};
  }
};

// 예상 처리 시간 계산
export const getEstimatedProcessingTime = (type: "guided" | "free"): string => {
  const now = new Date();
  const hour = now.getHours();

  // 업무시간 체크 (평일 9-18시)
  const isBusinessHour = hour >= 9 && hour < 18;
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;

  if (type === "guided") {
    return isBusinessHour && isWeekday ? "4시간 이내" : "24시간 이내";
  } else {
    return isBusinessHour && isWeekday ? "24시간 이내" : "48시간 이내";
  }
};
```

---

## 🗄️ 데이터베이스 스키마

### 1. 메인 테이블: consultations

```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('guided', 'free')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'contacted', 'completed', 'cancelled')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- 연락처 정보
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  contact_company VARCHAR(100),
  preferred_contact_time VARCHAR(20)
    CHECK (preferred_contact_time IN ('morning', 'afternoon', 'evening', 'anytime')),

  -- 메타데이터
  user_agent TEXT,
  ip_address INET,
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- 관리 정보
  assigned_to UUID REFERENCES users(id),
  assigned_at TIMESTAMP WITH TIME ZONE,

  -- 시간 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스
CREATE INDEX idx_consultations_number ON consultations(consultation_number);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);
CREATE INDEX idx_consultations_email ON consultations(contact_email);
```

### 2. 가이드 상담 상세: guided_consultations

```sql
CREATE TABLE guided_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  -- Step 1: 서비스 종류
  service_type VARCHAR(20) NOT NULL
    CHECK (service_type IN ('homepage', 'shopping', 'booking', 'membership', 'other')),

  -- Step 2: 규모와 예산
  project_size VARCHAR(20) NOT NULL
    CHECK (project_size IN ('small', 'medium', 'large')),
  budget VARCHAR(20) NOT NULL
    CHECK (budget IN ('100-300', '300-800', '800-1500', '1500+', 'consult')),

  -- Step 3: 일정과 기능
  timeline VARCHAR(20) NOT NULL
    CHECK (timeline IN ('1month', '2-3months', '6months', 'flexible')),
  important_features VARCHAR(20)[] DEFAULT '{}',
  additional_requests TEXT,

  -- 시간 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_guided_consultations_consultation_id ON guided_consultations(consultation_id);
CREATE INDEX idx_guided_consultations_service_type ON guided_consultations(service_type);
CREATE INDEX idx_guided_consultations_budget ON guided_consultations(budget);
```

### 3. 자유 상담 상세: free_consultations

```sql
CREATE TABLE free_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  -- 프로젝트 설명
  project_description TEXT NOT NULL,
  budget_range VARCHAR(100),
  timeline_preference VARCHAR(100),

  -- 시간 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_free_consultations_consultation_id ON free_consultations(consultation_id);
```

### 4. 상담 로그: consultation_logs

```sql
CREATE TABLE consultation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  action VARCHAR(50) NOT NULL,
  details JSONB,
  actor_type VARCHAR(20) NOT NULL CHECK (actor_type IN ('user', 'admin', 'system')),
  actor_id UUID REFERENCES users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_consultation_logs_consultation_id ON consultation_logs(consultation_id);
CREATE INDEX idx_consultation_logs_created_at ON consultation_logs(created_at);
CREATE INDEX idx_consultation_logs_action ON consultation_logs(action);
```

### 5. 관리자 사용자: users (기존 테이블 확장)

```sql
-- 기존 users 테이블에 상담 관련 권한 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_manage_consultations BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS consultation_department VARCHAR(50);
```

### 6. 데이터베이스 뷰 및 함수

```sql
-- 상담 요약 뷰
CREATE VIEW consultation_summary AS
SELECT
  c.id,
  c.consultation_number,
  c.type,
  c.status,
  c.priority,
  c.contact_name,
  c.contact_email,
  c.contact_phone,
  c.created_at,
  c.assigned_to,
  u.name as assigned_to_name,

  -- 가이드 상담 정보
  gc.service_type,
  gc.project_size,
  gc.budget,
  gc.timeline,

  -- 자유 상담 정보
  fc.project_description,
  fc.budget_range,
  fc.timeline_preference

FROM consultations c
LEFT JOIN guided_consultations gc ON c.id = gc.consultation_id
LEFT JOIN free_consultations fc ON c.id = fc.consultation_id
LEFT JOIN users u ON c.assigned_to = u.id;

-- 통계 함수
CREATE OR REPLACE FUNCTION get_consultation_stats(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
  total_consultations BIGINT,
  guided_consultations BIGINT,
  free_consultations BIGINT,
  pending_consultations BIGINT,
  completed_consultations BIGINT,
  avg_response_time INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_consultations,
    COUNT(*) FILTER (WHERE type = 'guided') as guided_consultations,
    COUNT(*) FILTER (WHERE type = 'free') as free_consultations,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_consultations,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_consultations,
    AVG(contacted_at - created_at) FILTER (WHERE contacted_at IS NOT NULL) as avg_response_time
  FROM consultations
  WHERE created_at::date BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql;
```

---

## ⚠️ 에러 처리 및 검증

### 1. 클라이언트 사이드 검증

```typescript
// utils/clientValidation.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// 실시간 입력 검증
export const validateField = (
  fieldName: string,
  value: any,
  rules: ValidationRule[]
): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    const result = rule.validate(value);
    if (!result.isValid) {
      errors.push(result.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 검증 규칙 인터페이스
interface ValidationRule {
  validate: (value: any) => { isValid: boolean; message: string };
}

// 공통 검증 규칙들
export const ValidationRules = {
  required: (message = "필수 입력 항목입니다"): ValidationRule => ({
    validate: (value) => ({
      isValid: value !== null && value !== undefined && value !== "",
      message,
    }),
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => ({
      isValid: typeof value === "string" && value.length >= min,
      message: message || `최소 ${min}자 이상 입력해주세요`,
    }),
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => ({
      isValid: typeof value === "string" && value.length <= max,
      message: message || `최대 ${max}자 이하로 입력해주세요`,
    }),
  }),

  email: (message = "올바른 이메일 주소를 입력해주세요"): ValidationRule => ({
    validate: (value) => ({
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message,
    }),
  }),

  phone: (message = "올바른 휴대폰 번호를 입력해주세요"): ValidationRule => ({
    validate: (value) => ({
      isValid: /^010-?\d{4}-?\d{4}$/.test(value),
      message,
    }),
  }),
};

// 사용 예시
const emailValidation = validateField("email", userInput, [
  ValidationRules.required(),
  ValidationRules.email(),
]);
```

### 2. 에러 표시 컴포넌트

```typescript
// components/shared/ErrorDisplay.tsx

interface ErrorDisplayProps {
  errors: string[];
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errors,
  className,
}) => {
  if (errors.length === 0) return null;

  return (
    <div className={`error-display ${className}`} role="alert">
      {errors.length === 1 ? (
        <div className="error-display__single">
          <span className="error-display__icon">⚠️</span>
          <span className="error-display__message">{errors[0]}</span>
        </div>
      ) : (
        <div className="error-display__multiple">
          <div className="error-display__title">
            <span className="error-display__icon">⚠️</span>
            다음 문제를 해결해주세요:
          </div>
          <ul className="error-display__list">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

### 3. 글로벌 에러 핸들러

```typescript
// utils/errorHandler.ts

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  DUPLICATE_SUBMISSION: "DUPLICATE_SUBMISSION",
} as const;

// 에러 메시지 매핑
export const ErrorMessages = {
  [ErrorCodes.VALIDATION_ERROR]: "입력 정보를 다시 확인해주세요.",
  [ErrorCodes.NETWORK_ERROR]: "네트워크 연결을 확인해주세요.",
  [ErrorCodes.SERVER_ERROR]:
    "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  [ErrorCodes.RATE_LIMIT_ERROR]:
    "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  [ErrorCodes.DUPLICATE_SUBMISSION]: "이미 처리 중인 요청입니다.",
} as const;

// API 에러 처리
export const handleApiError = (error: any): AppError => {
  if (error.response) {
    // HTTP 에러 응답
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return new AppError(
          data.message || ErrorMessages.VALIDATION_ERROR,
          ErrorCodes.VALIDATION_ERROR,
          400
        );
      case 429:
        return new AppError(
          ErrorMessages.RATE_LIMIT_ERROR,
          ErrorCodes.RATE_LIMIT_ERROR,
          429
        );
      case 500:
        return new AppError(
          ErrorMessages.SERVER_ERROR,
          ErrorCodes.SERVER_ERROR,
          500
        );
      default:
        return new AppError(
          data.message || ErrorMessages.SERVER_ERROR,
          ErrorCodes.SERVER_ERROR,
          status
        );
    }
  } else if (error.request) {
    // 네트워크 에러
    return new AppError(
      ErrorMessages.NETWORK_ERROR,
      ErrorCodes.NETWORK_ERROR,
      0
    );
  } else {
    // 기타 에러
    return new AppError(
      error.message || ErrorMessages.SERVER_ERROR,
      ErrorCodes.SERVER_ERROR,
      500
    );
  }
};
```

### 4. 재시도 로직

```typescript
// utils/retry.ts

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // 네트워크 에러나 5xx 서버 에러의 경우만 재시도
    return !error.response || error.response.status >= 500;
  },
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> => {
  const config = { ...defaultRetryOptions, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // 마지막 시도이거나 재시도 조건을 만족하지 않으면 에러 던지기
      if (attempt === config.maxRetries || !config.retryCondition!(error)) {
        throw error;
      }

      // 백오프 지연
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

// 사용 예시
const submitWithRetry = async (consultationData: any) => {
  return withRetry(() => submitConsultation(consultationData), {
    maxRetries: 3,
    baseDelay: 1000,
    retryCondition: (error) => {
      // 4xx 클라이언트 에러는 재시도하지 않음
      return !error.response || error.response.status >= 500;
    },
  });
};
```

---

## 🔒 보안 고려사항

### 1. 입력 검증 및 Sanitization

```typescript
// utils/security.ts

import DOMPurify from "isomorphic-dompurify";

// XSS 방지를 위한 HTML sanitization
export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // HTML 태그 모두 제거
    ALLOWED_ATTR: [],
  });
};

// SQL Injection 방지를 위한 입력 검증
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>'"`;\\]/g, "") // 위험한 문자 제거
    .substring(0, 1000); // 최대 길이 제한
};

// 이메일 주소 마스킹 (로그용)
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return email;

  const maskedLocal =
    localPart[0] + "*".repeat(localPart.length - 2) + localPart.slice(-1);
  return `${maskedLocal}@${domain}`;
};

// 전화번호 마스킹 (로그용)
export const maskPhone = (phone: string): string => {
  return phone.replace(/(\d{3})-?(\d{2})\d{2}-?(\d{4})/, "$1-$2**-$3");
};
```

### 2. Rate Limiting

```typescript
// utils/rateLimiter.ts

import { LRUCache } from "lru-cache";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

class RateLimiter {
  private cache: LRUCache<string, number[]>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cache = new LRUCache({
      max: 10000,
      ttl: config.windowMs,
    });
  }

  check(identifier: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    let requests = this.cache.get(identifier) || [];

    // 윈도우 밖의 요청들 제거
    requests = requests.filter((time) => time > windowStart);

    if (requests.length >= this.config.maxRequests) {
      return {
        allowed: false,
        resetTime: Math.min(...requests) + this.config.windowMs,
      };
    }

    requests.push(now);
    this.cache.set(identifier, requests);

    return { allowed: true };
  }
}

// 상담 신청용 레이트 리미터
export const consultationRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15분
  maxRequests: 3, // 15분에 최대 3회
  message: "너무 많은 상담 신청이 발생했습니다. 15분 후 다시 시도해주세요.",
});

// Express 미들웨어
export const rateLimitMiddleware = (rateLimiter: RateLimiter) => {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const identifier = getClientIP(req);
    const result = rateLimiter.check(identifier);

    if (!result.allowed) {
      return res.status(429).json({
        success: false,
        message: rateLimiter.config.message,
        error: {
          type: "rate_limit",
          resetTime: result.resetTime,
        },
      });
    }

    next();
  };
};
```

### 3. 개인정보 처리

```typescript
// utils/privacy.ts

// GDPR/개인정보보호법 준수를 위한 유틸리티

export interface PersonalData {
  name: string;
  phone: string;
  email: string;
  company?: string;
}

// 개인정보 암호화 (저장 시)
export const encryptPersonalData = (
  data: PersonalData
): EncryptedPersonalData => {
  // 실제 구현 시 crypto 라이브러리 사용
  return {
    name: encrypt(data.name),
    phone: encrypt(data.phone),
    email: encrypt(data.email),
    company: data.company ? encrypt(data.company) : undefined,
  };
};

// 개인정보 복호화 (조회 시)
export const decryptPersonalData = (
  encryptedData: EncryptedPersonalData
): PersonalData => {
  return {
    name: decrypt(encryptedData.name),
    phone: decrypt(encryptedData.phone),
    email: decrypt(encryptedData.email),
    company: encryptedData.company ? decrypt(encryptedData.company) : undefined,
  };
};

// 데이터 보존 기간 체크
export const checkDataRetention = (createdAt: Date): boolean => {
  const retentionPeriod = 3 * 365 * 24 * 60 * 60 * 1000; // 3년
  const now = new Date().getTime();
  const created = createdAt.getTime();

  return now - created > retentionPeriod;
};

// 개인정보 삭제 (자동화된 데이터 삭제용)
export const scheduleDataDeletion = async (consultationId: string) => {
  // 실제 구현 시 큐 시스템이나 스케줄러 사용
  console.log(`Scheduling data deletion for consultation ${consultationId}`);
};
```

### 4. 접근 제어

```typescript
// middleware/auth.ts

export const requireAuth = (handler: NextApiHandler): NextApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "인증이 필요합니다.",
        });
      }

      // JWT 토큰 검증
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = payload;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 인증 정보입니다.",
      });
    }
  };
};

// 권한 체크
export const requirePermission = (permission: string) => {
  return (handler: NextApiHandler): NextApiHandler => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      if (!req.user?.permissions?.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: "권한이 없습니다.",
        });
      }

      return handler(req, res);
    };
  };
};
```

---

## ⚡ 성능 최적화

### 1. 프론트엔드 최적화

```typescript
// hooks/useOptimizedSubmit.ts

import { useCallback, useRef } from "react";
import { debounce } from "lodash";

// 중복 제출 방지
export const useOptimizedSubmit = () => {
  const submissionRef = useRef<Promise<any> | null>(null);
  const lastSubmitTime = useRef<number>(0);

  const submitWithOptimization = useCallback(
    async (submitFunction: () => Promise<any>, minInterval: number = 1000) => {
      const now = Date.now();

      // 최소 간격 체크
      if (now - lastSubmitTime.current < minInterval) {
        throw new Error("너무 빠른 연속 요청입니다.");
      }

      // 진행 중인 요청이 있으면 대기
      if (submissionRef.current) {
        return submissionRef.current;
      }

      try {
        lastSubmitTime.current = now;
        submissionRef.current = submitFunction();
        const result = await submissionRef.current;
        return result;
      } finally {
        submissionRef.current = null;
      }
    },
    []
  );

  return { submitWithOptimization };
};

// 자동 저장 (디바운스 적용)
export const useAutoSave = (
  saveFunction: (data: any) => void,
  delay: number = 2000
) => {
  const debouncedSave = useCallback(debounce(saveFunction, delay), [
    saveFunction,
    delay,
  ]);

  return debouncedSave;
};
```

### 2. 백엔드 최적화

```typescript
// utils/databaseOptimization.ts

// 연결 풀링
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// 배치 처리
export const batchInsertConsultations = async (consultations: any[]) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertQuery = `
      INSERT INTO consultations (
        consultation_number, type, contact_name, contact_email, contact_phone
      ) VALUES ($1, $2, $3, $4, $5)
    `;

    for (const consultation of consultations) {
      await client.query(insertQuery, [
        consultation.consultationNumber,
        consultation.type,
        consultation.contactName,
        consultation.contactEmail,
        consultation.contactPhone,
      ]);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// 캐싱
import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export const cacheConsultationStats = async (stats: any) => {
  await redis.setex("consultation_stats", 300, JSON.stringify(stats)); // 5분 캐시
};

export const getCachedConsultationStats = async () => {
  const cached = await redis.get("consultation_stats");
  return cached ? JSON.parse(cached) : null;
};
```

### 3. 이미지 및 에셋 최적화

```typescript
// utils/imageOptimization.ts

// Next.js Image 컴포넌트 설정
export const optimizedImageProps = {
  quality: 85,
  formats: ["webp", "avif"],
  placeholder: "blur" as const,
  loading: "lazy" as const,
};

// CSS 최적화를 위한 critical CSS 추출
export const criticalStyles = `
  .consultation-start,
  .progress-bar,
  .service-card,
  .navigation {
    /* 중요한 스타일만 인라인으로 포함 */
  }
`;
```

### 4. 번들 최적화

```javascript
// next.config.js
module.exports = {
  // 코드 스플리팅
  experimental: {
    optimizeCss: true,
  },

  // 번들 분석
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 번들 최적화 설정
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        // 상담 관련 코드를 별도 청크로 분리
        consultation: {
          name: "consultation",
          chunks: "all",
          test: /[\\/]consultation[\\/]/,
          priority: 40,
          enforce: true,
        },
        // 공통 라이브러리
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
          priority: 30,
          reuseExistingChunk: true,
        },
      };
    }

    return config;
  },

  // 압축 및 최적화
  compress: true,
  poweredByHeader: false,

  // 이미지 도메인 설정
  images: {
    domains: ["example.com"],
    formats: ["image/webp", "image/avif"],
  },
};
```

---

## 📊 모니터링 및 분석

### 1. 성능 모니터링

```typescript
// utils/monitoring.ts

// 페이지 로드 시간 측정
export const measurePageLoad = (pageName: string) => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // 분석 도구로 전송
    gtag("event", "page_load_time", {
      page_name: pageName,
      load_time: Math.round(loadTime),
      category: "Performance",
    });
  };
};

// API 응답 시간 측정
export const measureApiResponse = async <T>(
  apiCall: () => Promise<T>,
  endpoint: string
): Promise<T> => {
  const startTime = Date.now();

  try {
    const result = await apiCall();
    const duration = Date.now() - startTime;

    // 성공 시 메트릭 전송
    gtag("event", "api_response_time", {
      endpoint,
      duration,
      status: "success",
    });

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;

    // 실패 시 에러 메트릭 전송
    gtag("event", "api_response_time", {
      endpoint,
      duration,
      status: "error",
      error_message: error.message,
    });

    throw error;
  }
};
```

### 2. 사용자 행동 분석

```typescript
// utils/analytics.ts

// 상담 단계별 이탈률 추적
export const trackConsultationStep = (step: number, trackType: string) => {
  gtag("event", "consultation_step", {
    step_number: step,
    track_type: trackType,
    category: "Consultation Flow",
  });
};

// 폼 필드별 상호작용 추적
export const trackFieldInteraction = (fieldName: string, action: string) => {
  gtag("event", "form_interaction", {
    field_name: fieldName,
    action, // focus, blur, change, error
    category: "Form Interaction",
  });
};

// 에러 발생 추적
export const trackError = (
  errorType: string,
  errorMessage: string,
  context?: any
) => {
  gtag("event", "exception", {
    description: errorMessage,
    fatal: false,
    error_type: errorType,
    context: JSON.stringify(context),
  });
};

// 완료율 및 변환 추적
export const trackConsultationCompletion = (
  consultationType: string,
  consultationId: string,
  timeToComplete: number
) => {
  // Google Analytics 변환 이벤트
  gtag("event", "purchase", {
    transaction_id: consultationId,
    value: 1,
    currency: "KRW",
    items: [
      {
        item_id: consultationType,
        item_name: `${consultationType} consultation`,
        item_category: "Consultation",
        quantity: 1,
      },
    ],
  });

  // 맞춤 완료 이벤트
  gtag("event", "consultation_completed", {
    consultation_type: consultationType,
    consultation_id: consultationId,
    time_to_complete: timeToComplete,
    category: "Conversion",
  });
};
```

### 3. 대시보드 데이터

```typescript
// utils/dashboardData.ts

export interface ConsultationMetrics {
  totalConsultations: number;
  guidedConsultations: number;
  freeConsultations: number;
  completionRate: number;
  averageResponseTime: number;
  topServiceTypes: Array<{ type: string; count: number }>;
  dailyTrends: Array<{ date: string; count: number }>;
}

export const getConsultationMetrics = async (
  startDate: Date,
  endDate: Date
): Promise<ConsultationMetrics> => {
  const { data: consultations } = await supabaseAdmin
    .from("consultation_summary")
    .select("*")
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  const total = consultations.length;
  const guided = consultations.filter((c) => c.type === "guided").length;
  const free = consultations.filter((c) => c.type === "free").length;
  const completed = consultations.filter(
    (c) => c.status === "completed"
  ).length;

  const serviceTypeCounts = consultations
    .filter((c) => c.service_type)
    .reduce((acc, c) => {
      acc[c.service_type] = (acc[c.service_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topServiceTypes = Object.entries(serviceTypeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalConsultations: total,
    guidedConsultations: guided,
    freeConsultations: free,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    averageResponseTime: 0, // 추후 계산 로직 추가
    topServiceTypes,
    dailyTrends: [], // 추후 계산 로직 추가
  };
};
```

---

이상으로 LeoFitTech 상담 신청 시스템의 종합적인 설계 문서를 완성했습니다. 이 문서는 API 설계, UI/UX, 코드 구현, 데이터베이스 스키마, 에러 처리, 보안, 성능 최적화까지 모든 측면을 포괄하고 있으며, 실제 개발 시 바로 활용할 수 있는 상세한 코드 예시와 모범 사례들을 포함하고 있습니다.
