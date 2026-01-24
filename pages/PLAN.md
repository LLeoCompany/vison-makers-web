# 🚀 Project: RAG-LLM Agency Landing Page (Final v5.0)

**"10만 유저가 검증한 실전 RAG 기술력을 귀사의 데이터에 이식합니다."**

## 1. 디자인 철학 및 컬러 전략 (The Psychology of Color)

디자인은 단순히 예쁜 것이 아니라, 클라이언트의 의구심을 확신으로 바꾸는 도구로 사용합니다.

- **Deep Space Black (#0A0A0F)**: '전문성/신뢰'. 가벼운 챗봇 업체가 아닌 딥테크 기업의 묵직한 인상을 줌.
- **Electric Cyan (#00BFFF)**: '지능/정확도'. RAG의 핵심인 스마트한 검색과 정확한 답변 기술을 상징. (Highlight & Vector Line)
- **DevGym Green (#48BB78)**: '실적/성공'. 이미 10만 회원이 사용 중인 '실체'가 있음을 강조하여 안도감 부여. (Success Badge & Metrics)
- **Vivid Crimson (#E94560)**: '행동/긴급'. 무채색 톤에서 시선을 강탈하여 즉각적인 상담 신청 유도. (Main CTA)

---

## 2. 웹사이트 구조 및 섹션 디테일 (The 6-Step Flow)

### [Section 1] Hero: The Evidence (100vh)

- **Copy**: "이미 10만 회원 데이터에서 검증된 RAG LLM 플랫폼"
- **Layout**: 좌측(텍스트 & 기술 뱃지), 우측(실제 RAG 엔진 데모 윈도우).
- **Detail**: 배경에 데이터 입자가 흐르는 **Vector Space Particle** 효과 적용. 데모 윈도우는 Mac OS 스타일의 프레임을 사용하여 '실제 제품' 느낌을 줌.

### [Section 2] Solution Cards (3-Card Layout)

- **Card 1**: RAG 시스템 구축 (데이터 보안 & 실시간 검색 특화)
- **Card 2**: AI 챗봇 (DevGym 78% 자동화 성공 로직 이식)
- **Card 3**: 추천 시스템 (10만 회원 기반 ROI 3배 향상 검증)
- **Design**: 중앙 카드(챗봇)에 **Gradient Border**와 **Glow** 효과를 주어 가장 먼저 시선을 끌게 배치.

### [Section 3] DevGym Proof (Bento Grid)

- **Visual**: 관리자 대시보드, 유저 앱화면 등을 3D Perspective 효과가 들어간 **Bento Box 그리드**로 배치.
- **Hook**: "데이터만 교체하면 8주 내 금융, 의료, 제조 맞춤형 서비스 완성."

### [Section 4] RAG Flow (Step-by-Step)

- **Flow**: 데이터 유입 -> 벡터화 -> 지식 추출(RAG) -> AI 답변.
- **Interaction**: 사용자가 스크롤할 때마다 데이터가 파이프라인을 따라 이동하는 듯한 **Dash-line 애니메이션**.

### [Section 5] Trust Metrics (Social Proof)

- **Metrics**: 10만+ 회원, 92% 정확도, 1.2s 응답시간.
- **Animation**: 숫자가 빠르게 올라가는 **Count-up 효과**와 실제 고객사 후기 슬라이더 배치.

### [Section 6] Final CTA Form (Conversion)

- **Layout**: 카드 내부에 직관적인 입력 폼 배치.
- **Form**: 담당자 정보, 관심 서비스(버튼형 체크박스), 산업군(Dropdown).
- **Trust Label**: "24시간 내 회신 / 계약 무의무 / DevGym PDF 가이드 즉시 제공".

---

## 3. 바이브 코딩 실전 가이드 (Development Prompt)

**AI 에디터에게 아래 프롬프트를 입력하여 작업을 시작하세요:**

> "제공된 PLAN.md 파일의 구조와 디자인 철학을 바탕으로 Next.js, Tailwind CSS, Framer Motion을 사용한 랜딩 페이지를 빌드해줘.
>
> 1. **색감**: #0A0A0F 배경에 #00BFFF와 #E94560를 포인트로 활용해 하이엔드 테크 감성을 극대화해줘.
> 2. **애니메이션**: 섹션 이동 시 Framer Motion의 `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}` 효과를 적용해줘.
> 3. **데모 UI**: 섹션 1의 데모 윈도우는 실제 텍스트가 타이핑되고 출처가 표기되는 과정을 시뮬레이션해줘.
> 4. **반응형**: 모바일 기기(768px 이하)에서는 모든 그리드를 1열로 배치하고 히어로 섹션의 텍스트 크기를 최적화해줘.
> 5. **아이콘**: `lucide-react`를 사용하고 모든 아이콘에 통일된 선 두께(1.5px)를 적용해줘.
> 6. **폰트**: 기본 폰트는 Pretendard, 수치나 기술 용어는 JetBrains Mono를 섞어서 사용해줘."

---

## 4. 최종 검증 체크리스트

- [ ] 메인 CTA 버튼이 어느 섹션에서든 1회 이내의 스크롤로 접근 가능한가? (Sticky Header/Footer 적용)
- [ ] DevGym의 실적 수치가 강조되어 신뢰감을 주는가?
- [ ] RAG 엔진의 '근거 제시(Source Trace)' 기능이 시각적으로 표현되었는가?
- [ ] 복잡한 기술 용어를 비전문가가 봐도 알기 쉬운 인포그래픽으로 풀었는가?
