# LeoFitTech Web Platform - 설계 문서

## 📋 프로젝트 개요

### 기본 정보

- **프로젝트명**: LeoFitTech Web Platform
- **버전**: 0.1.0
- **타입**: B2B 웹 개발 서비스 마케팅 랜딩 페이지
- **목적**: 상담 신청 전환 최적화된 풀페이지 웹사이트

### 비즈니스 목표

- 웹 개발 서비스 상담 신청 리드 생성
- 기획-디자인-개발 통합 서비스 어필
- 7단계 체계적 프로세스 신뢰성 구축

---

## 🏗️ 기술 아키텍처

### 기술 스택

#### Frontend

- **Framework**: Next.js 14.2.3 (Pages Router)
- **Language**: TypeScript 5.x
- **Styling**:
  - Tailwind CSS 3.4.1
  - SASS/SCSS 1.77.1
  - styled-jsx (인라인 스타일)
- **UI Libraries**:
  - `@shinyongjun/react-fullpage` 1.10.0 - 풀페이지 스크롤
  - `react-awesome-reveal` 4.2.11 - 애니메이션
- **Font**: Pretendard 1.3.9 (한글 웹폰트)

#### Backend

- **API Routes**: Next.js API Routes
- **External API**: Claude AI (v1 Legacy)
- **Cloud Functions**: Firebase Functions
- **HTTP Client**: Axios 1.12.2

#### Deployment & Infrastructure

- **Frontend**: Vercel
- **Backend**: Firebase Functions
- **CDN**: Next.js + Vercel Edge Network
- **Domain Images**: Firebase Storage

#### Development Tools

- **TypeScript**: Strict 모드 활성화
- **ESLint**: Next.js 권장 설정
- **PostCSS**: Tailwind 처리

---

## 📁 프로젝트 구조

```
vison-makers-web/
├── src/
│   ├── pages/              # Next.js Pages Router
│   │   ├── _app.tsx        # 앱 진입점 & 전역 설정
│   │   ├── _document.tsx   # HTML Document 구조
│   │   ├── index.tsx       # 메인 랜딩 페이지
│   │   ├── sub.tsx         # 상담 신청 폼 페이지
│   │   └── api/            # API 엔드포인트
│   │       ├── claude-chat.js         # Claude AI 채팅
│   │       ├── hello.ts               # 헬스체크
│   │       └── sendInquireSlackMessage.js  # Slack 알림
│   ├── compoents/ [오타]   # 재사용 컴포넌트
│   │   ├── Header.tsx      # 네비게이션 헤더
│   │   └── Footer.tsx      # 회사 정보 푸터
│   └── styles/             # 스타일 파일
│       ├── globals.css     # 전역 CSS
│       └── style.scss      # 메인 SCSS (15KB+)
├── functions/              # Firebase Functions
│   ├── index.js           # Slack 웹훅 함수들
│   ├── package.json       # 서버사이드 의존성
│   └── node_modules/      # 서버 의존성
├── public/                # 정적 자산
│   ├── images/           # 아이콘, 비주얼 (20+ PNG)
│   ├── video/            # 메인 비디오 (MP4)
│   ├── favicon.ico
│   └── vercel.svg
├── 설정 파일
│   ├── next.config.js     # Next.js 설정
│   ├── tailwind.config.ts # Tailwind 설정
│   ├── tsconfig.json      # TypeScript 설정
│   ├── firebase.json      # Firebase 배포 설정
│   └── vercel.json        # Vercel 배포 설정
└── package.json           # 프로젝트 의존성
```

---

## 🎨 UI/UX 설계

### 디자인 시스템

#### 색상 팔레트

- **Primary**: `#ff4c4c` (빨간색)
- **Typography**: 기본 검은색/회색 계열

#### 타이포그래피

- **폰트 패밀리**: Pretendard (한글 최적화)
- **기본 크기**: 15px
- **반응형 크기**:
  - 데스크톱 (>1440px): 15px
  - 노트북 (>1024px): 14px
  - 태블릿 (>768px): 13px
  - 모바일 (≤480px): 12px

#### 레이아웃

- **풀페이지 스크롤**: 섹션별 전체 화면 점유
- **반응형**: 모바일 퍼스트 접근법
- **그리드**: CSS Grid + Flexbox 혼용

### 애니메이션 시스템

```jsx
// react-awesome-reveal 사용
<Fade direction="up">        // 아래에서 위로
<Fade direction="left">      // 왼쪽에서 오른쪽
<Fade direction="right">     // 오른쪽에서 왼쪽
<Fade delay={100,200,300}>   // 순차 등장 (ms)
```

---

## 📱 페이지 구조 및 기능

### 1. 메인 페이지 (`/`)

#### 풀페이지 섹션 구조

1. **content01 (히어로)**:

   - 메인 캐치프레이즈
   - 백그라운드 비디오 (`main-visual.mp4`)
   - 첫 번째 CTA "5초만에 상담받기"

2. **content02 (문제 제기)**:

   - "외주시장 90% 실패 이유?"
   - 기획 중요성 강조
   - 좌우 애니메이션 배치

3. **content03 (해결책)**:

   - 7단계 프로젝트 진행 과정
   - 아이콘 + 설명 카드 레이아웃
   - 순차 애니메이션 (100ms 간격)

4. **content05 (긴급감 조성)**:

   - 마케팅 투자 필요성 강조
   - 두 번째 CTA "5초만에 상담받기"

5. **Footer 섹션**:
   - 회사 정보 (레오핏테크)
   - 연락처 및 사업자 정보

#### 상호작용 요소

- **헤더 네비게이션**: 섹션 간 스크롤 링크
- **CTA 버튼**: 총 3개 (`/sub` 라우팅)
- **마우스 휠**: 섹션 간 전환

### 2. 상담 신청 페이지 (`/sub`)

#### 폼 필드 구조

```typescript
interface FormData {
  name: string; // 이름 (필수 아님)
  phone: string; // 연락처
  email: string; // 이메일
  duration: string; // 작업 기간
  details: string; // 작업 내용
}
```

#### 사용자 경험

- **로딩 상태**: 폼 비활성화 + 오버레이
- **에러 처리**: Browser Alert 사용
- **성공 처리**: 홈페이지 리다이렉션
- **개인정보 동의**: 문구 표시 (실제 검증 없음)

---

## 🔄 데이터 플로우

### 상담 신청 처리 흐름

```mermaid
graph TD
    A[사용자 폼 입력] --> B[/api/sendInquireSlackMessage]
    B --> C[Firebase Cloud Function]
    C --> D[Slack Webhook]
    D --> E[Slack 채널 알림]
    B --> F[성공 응답]
    F --> G[홈페이지 리다이렉션]
```

#### 1단계: 프론트엔드 → Next.js API

```javascript
// src/pages/sub.tsx
const response = await fetch("/api/sendInquireSlackMessage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

#### 2단계: Next.js API → Firebase Functions

```javascript
// src/pages/api/sendInquireSlackMessage.js
const response = await fetch(
  "https://us-central1-vison-makers.cloudfunctions.net/sendMessageToSlack",
  {
    method: "POST",
    body: JSON.stringify({ text: formattedMessage }),
  }
);
```

#### 3단계: Firebase Functions → Slack

```javascript
// functions/index.js
await axios.post(
  "https://hooks.slack.com/services/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",
  { text: text }
);
```

### Claude AI 채팅 플로우 (사용 안함)

```javascript
// src/pages/api/claude-chat.js (Legacy)
const response = await axios.post("https://api.anthropic.com/v1/complete", {
  model: "claude-2",
  prompt: conversationPrompt,
  max_tokens_to_sample: 500,
});
```

---

## 🚀 배포 및 인프라

### Vercel 설정

```json
// vercel.json
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
    }
  ]
}
```

### Firebase 설정

```json
// firebase.json
{
  "functions": {
    "source": "functions"
  },
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  }
}
```

### Next.js 최적화

```javascript
// next.config.js
{
  reactStrictMode: true,
  swcMinify: true,  // SWC 컴파일러 사용
  images: {
    domains: ["storage.googleapis.com", "vison-makers.appspot.com"]
  }
}
```

---

## 🔧 개발 워크플로우

### 스크립트 명령어

```json
{
  "dev": "next dev", // 개발 서버 (포트 3000)
  "build": "next build", // 프로덕션 빌드
  "start": "next start", // 프로덕션 서버
  "lint": "next lint" // ESLint 검사
}
```

### TypeScript 설정

- **Strict 모드**: 활성화
- **Path Mapping**: `@/*` → `./src/*`
- **모듈 해상도**: Bundler 방식

### 코드 품질

- **ESLint**: Next.js 권장 설정
- **TypeScript**: 타입 안전성 (일부 `any` 사용)
- **Prettier**: 설정 없음

---

## 📊 성능 및 최적화

### 번들 분석 (빌드 결과)

```
Route (pages)                    Size     First Load JS
┌ ○ /                           20.9 kB   102 kB
├ ○ /sub                        5.21 kB   86.2 kB
├ ƒ /api/claude-chat            0 B       78.5 kB
├ ƒ /api/sendInquireSlackMessage 0 B      78.5 kB
└ First Load JS shared by all   82.1 kB
```

### 최적화 전략

- **정적 생성**: 메인 페이지 사전 렌더링
- **이미지 최적화**: Next.js Image 컴포넌트 (일부 미적용)
- **코드 분할**: 자동 페이지별 청크 분리
- **폰트 최적화**: CDN을 통한 Pretendard 로드

### 성능 메트릭

- **개발 서버 시작**: ~1.6초
- **빌드 시간**: ~30초
- **First Load JS**: < 110KB (양호)

---

## ⚠️ 알려진 이슈 및 제한사항

### 보안 취약점

1. **Critical**: Next.js 14.2.3 보안 업데이트 필요
2. **High**: Slack 웹훅 URL 하드코딩
3. **Moderate**: Firebase 종속성 취약점 다수

### 코드 품질 이슈

1. **디렉토리명 오타**: `compoents` → `components`
2. **타입 안전성**: `handleChange: (e: any)` 사용
3. **이미지 최적화**: 일부 `<img>` 태그 사용
4. **접근성**: `alt` 속성 누락

### 기술 부채

1. **Claude API**: Legacy v1 API 사용 (deprecated)
2. **이중 API 호출**: Next.js API → Firebase → Slack
3. **검증 부족**: 폼 입력 검증 시스템 없음
4. **에러 처리**: Browser Alert만 사용

---

## 🔮 향후 개선 계획

### 우선순위 1 (보안)

- [ ] 보안 의존성 업데이트 (`npm audit fix`)
- [ ] 환경변수로 민감정보 이동
- [ ] API 엔드포인트 인증/인가 추가

### 우선순위 2 (사용자 경험)

- [ ] 폼 validation 라이브러리 도입
- [ ] Toast 알림 시스템 구현
- [ ] 상담 신청 성공 페이지 추가
- [ ] 로딩 상태 개선 (Skeleton UI)

### 우선순위 3 (기술 현대화)

- [ ] Claude API → Messages API v3 전환
- [ ] 직접 Slack API 호출로 단순화
- [ ] App Router 마이그레이션 검토
- [ ] 컴포넌트 라이브러리 도입

### 우선순위 4 (성능)

- [ ] 이미지 최적화 완료
- [ ] 번들 크기 최적화
- [ ] 접근성 개선
- [ ] SEO 최적화

---

## 📞 기술 연락처

### 개발팀

- **대표자**: 임세환
- **운영 및 개발**: Marko
- **이메일**: sh414lim@gmail.com

### 회사 정보

- **회사명**: 레오핏테크(LeoFitTech)
- **사업자 정보**: 응용 소프트웨어 개발 및 공급
- **브랜드명**: LeoFitTech

---

_문서 최종 수정: 2025-09-16_
_작성자: Claude Code Assistant_
