# 🎨 Vision AI 플랫폼 UI/UX 설계 기획서 (v1.0)

> **Vibe Coding 기반 Enterprise RAG & LLM 인프라 SaaS UI/UX 설계 문서**
> Target: SMB B2B / Admin First / High Trust Conversion

---

## 1. Project Overview

**Project Name**: Vision AI - Enterprise RAG Infrastructure for SMB
**Design Philosophy**: `Trust-First, Tech-Forward`
**Target Device**: Desktop First + Responsive Mobile

### 🎯 UX Goal

- Hero 3초 내 메시지 전달
- 상담 전환율 38%
- POC 전환율 12%
- ARR 목표 9천만

---

## 2. Design System (Design Tokens)

### Typography

| Type       | Font                  | Size |
| ---------- | --------------------- | ---- |
| Hero H1    | JetBrains Mono Bold   | 60px |
| Section H2 | Pretendard SemiBold   | 48px |
| Card H3    | JetBrains Mono Medium | 36px |
| Body       | Pretendard Regular    | 20px |
| Caption    | Pretendard Light      | 16px |
| Code       | JetBrains Mono        | 16px |

---

### Color Palette

| Token         | Color   | Purpose           |
| ------------- | ------- | ----------------- |
| Primary       | #1E3A8A | Trust, Enterprise |
| Secondary     | #10B981 | Growth, Security  |
| Accent        | #FF6200 | CTA, Action       |
| Neutral Dark  | #111827 | Background        |
| Neutral Light | #F9FAFB | Text              |
| Success       | #059669 | Verified          |
| Error         | #DC2626 | Risk              |

---

### Spacing System

`8px Grid`

xs:8, s:16, m:24, l:32, xl:40, 2xl:48, 3xl:64, 4xl:80

---

## 3. Site Map & IA

```
Main (Landing)
 ├ Hero
 ├ Legacy vs Vision AI
 ├ 5-Layer Defense Infra
 ├ Process Visualization
 ├ Social Proof
 ├ Industry Solutions
 ├ Admin Dashboard Preview
 └ Contact / Pricing

Technology
Solutions
Dashboard Demo
Pricing / Contact
```

---

## 4. UX Core Principles

### 1) Trust First

- 모든 AI 응답에 Source Tag 표시
- 보안 상태 뱃지: `Encryption Active`, `Private DB`

### 2) Cognitive Simplicity

- Z-Pattern + Fitts’s Law
- 핵심 CTA 항상 48px 이상

### 3) Security Visualization

- 데이터 → 보호막 → 결과 구조 시각화

---

## 5. Landing Page Section Design

### Section 1: Hero (Above The Fold)

**Goal**: 3초 안에 가치 전달

```jsx
<Hero>
  <Badge>Enterprise Knowledge, Secured.</Badge>
  <H1>
    대기업은 이미 가졌습니다.
    <br />
    중소기업 차례입니다.
  </H1>
  <Sub>Enterprise RAG & LLM 인프라</Sub>
  <CTA>
    <Button>2주 POC 신청</Button>
    <Button variant="outline">데모 보기</Button>
  </CTA>
</Hero>
```

UX Rules:

- Particle Network Animation
- Framer Motion Sequential Text

---

### Section 2: Legacy vs Vision AI

**UX Rule**: Contrast + Motion

```jsx
<Grid columns="2">
  <LegacyCard />
  <VisionCard />
</Grid>
```

좌측: 환각, 보안 리스크
우측: RAG + Permission + Action

---

### Section 3: 5-Layer Defense Architecture

```
User → Guardrail → Retrieval → Orchestration → Verified Answer
```

Hover Interaction:

- RBAC
- Hybrid Search
- Self-Correction

---

### Section 4: Process Visualization

```jsx
<ProcessDemo>
  <Input />
  <Steps />
  <Output confidence="98%" />
</ProcessDemo>
```

---

### Section 5: Social Proof

- Authority + KPI

```jsx
<ProofGrid columns="3">
  <Case />
  <Case />
  <Case />
</ProofGrid>
```

---

### Section 6: Industry Landing Template

```
Hero → Demo → KPI → CTA
```

Industry Color Mapping:

```js
const industryColors = {
  legal: "#1E3A8A",
  fitness: "#10B981",
  manufacturing: "#4B5563",
  fnb: "#F59E0B",
};
```

---

## 6. Admin Dashboard UX

### 핵심 모듈

1. Chunk Visualizer
2. RAG Evaluation (RAGAS)
3. Bad Case Queue
4. Permission Manager
5. Document Pipeline

```jsx
<MetricsGrid>
  <Metric name="Faithfulness" value="0.92" />
  <Metric name="Precision" value="0.88" />
  <Metric name="Relevance" value="0.95" />
</MetricsGrid>
```

---

## 7. Vibe Coding Tech Stack

| Category  | Stack                   |
| --------- | ----------------------- |
| Framework | Next.js 14 (App Router) |
| Styling   | Tailwind + shadcn/ui    |
| Animation | Framer Motion           |
| Graphics  | Three.js / Canvas       |
| Icons     | Lucide React            |

---

## 8. Vibe Coding Prompt Rule

### RULE 1: Typography

- Hero → JetBrains Mono
- Body → Pretendard

### RULE 2: Security Visual

- 데이터는 항상 Shield UI 내부 배치

### RULE 3: Trust Signal

- Source Tag 필수
- 보안 Badge 기본 포함

---

## 9. Implementation Roadmap

### Phase 1

- GNB + Dark Layout + Design Tokens

### Phase 2

- Hero + Core Value Section

### Phase 3

- 5 Layer Architecture SVG Motion

### Phase 4

- Contact + Mobile Optimization

---

## 10. 3-Day Execution Plan

Day 1: Hero + Comparison
Day 2: Demo + Social Proof + CTA
Day 3: Admin Dashboard + Industry Pages
Day 4: Animation + Optimization + Deploy

---

## 11. KPI Quality Checklist

- [ ] Hero 3초 메시지 전달
- [ ] CTA 버튼 48px 이상
- [ ] Mobile 375px 깨짐 없음
- [ ] LCP ≤ 2.5s
- [ ] Color Contrast ≥ 4.5:1
- [ ] SEO Semantic Tag 적용

---

## 12. Final UX Mission

> **"신뢰 → 이해 → 확신 → 상담 → 도입"**

Vision AI UI/UX는 **기술이 아니라 ‘신뢰’ 를 파는 구조**로 설계한다.
