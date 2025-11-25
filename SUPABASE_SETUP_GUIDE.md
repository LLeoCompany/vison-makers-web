# LeoFitTech Supabase 직접 통신 설정 가이드

LeoFitTech 프로젝트의 Supabase 데이터베이스 직접 통신을 위한 완전한 설정 및 사용 가이드입니다.

## 🚀 빠른 시작

### 1. Supabase 프로젝트 설정

1. [Supabase Dashboard](https://app.supabase.com)에 접속
2. 새 프로젝트 생성: `LeoFitTech-consultation`
3. 데이터베이스 비밀번호 설정
4. 프로젝트 생성 완료 후 SQL Editor로 이동

### 2. 데이터베이스 스키마 생성

다음 순서대로 SQL 파일들을 실행하세요:

```sql
-- 1. 기본 스키마 생성
sql/001_initial_schema.sql

-- 2. RLS 정책 설정
sql/002_rls_policies.sql

-- 3. 초기 데이터 삽입
sql/003_initial_data.sql
```

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 Supabase 키를 설정하세요:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

### 4. 필수 의존성 설치

```bash
npm install @supabase/supabase-js bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

## 📋 환경변수 설정

`.env.local` 파일에 다음 변수들을 설정해주세요:

```env
# 필수 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 선택적 설정 (알림 등)
EMAIL_FROM=noreply@LeoFitTech.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
```

## 🗄️ 데이터베이스 구조

### 주요 테이블

1. **consultations** - 상담 신청 메인 테이블
2. **guided_consultations** - 가이드 상담 상세 정보
3. **free_consultations** - 자유 상담 상세 정보
4. **consultation_logs** - 상담 처리 로그
5. **consultation_stats** - 일별 통계 데이터

### 주요 뷰

1. **consultation_details** - 상담 정보 통합 뷰
2. **daily_stats_summary** - 일별 통계 요약
3. **consultation_status_counts** - 상태별 건수

## 🔧 직접 통신 사용법

### 1. 상담 신청 생성

```typescript
import { createGuidedConsultation } from "@/services/consultation";

const result = await createGuidedConsultation({
  contact_name: "홍길동",
  contact_phone: "010-1234-5678",
  contact_email: "hong@example.com",
  service_type: "web_development",
  project_size: "medium",
  budget: "1000_to_3000",
  timeline: "1_3_months",
  important_features: ["responsive_design", "cms"],
});

if (result.success) {
  console.log("상담 번호:", result.data.consultationNumber);
}
```

### 2. 관리자 로그인

```typescript
import { loginAdmin } from "@/services/auth";

const result = await loginAdmin({
  email: "admin@LeoFitTech.com",
  password: "LeoFitTech2024!",
});

if (result.success) {
  const { user, accessToken } = result.data;
}
```

### 3. 상담 목록 조회 (관리자)

```typescript
import { getConsultations } from "@/services/consultation";

const result = await getConsultations({
  page: 1,
  limit: 20,
  status: "pending",
  search: "홍길동",
});
```

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# Supabase 설정
npm run supabase:setup

# API 테스트
npm run test:api

# 타입 체크
npm run type-check

# 전체 테스트
npm test
```

## 📊 상담 신청 플로우

### 가이드 상담

1. 서비스 타입 선택 (homepage/shopping/booking/membership/other)
2. 프로젝트 규모 및 예산 선택
3. 일정 및 중요 기능 선택
4. 연락처 정보 입력

### 자유 상담

1. 프로젝트 상세 설명 작성
2. 연락처 정보 입력

## 🔒 보안 기능

- **Row Level Security (RLS)** - 모든 테이블에 적용
- **입력 검증** - Zod 스키마를 통한 강력한 유효성 검증
- **SQL 인젝션 방지** - 매개화된 쿼리 사용
- **XSS 방지** - 입력 데이터 정제
- **레이트 제한** - API 호출 빈도 제한 (구현 예정)

## 📈 모니터링 및 통계

### 수집되는 데이터

- **기본 정보**: 상담 타입, 상태, 우선순위
- **연락처**: 이름, 전화번호, 이메일, 회사명
- **메타데이터**: IP 주소, User Agent, 리퍼러 URL, UTM 파라미터
- **프로젝트 정보**: 서비스 타입, 규모, 예산, 일정

### 통계 메트릭

- **일별/주별/월별 상담 신청 수**
- **상담 타입별 분석**
- **상태별 분포**
- **전환율 분석**
- **트래픽 소스 분석**

## 🚨 문제 해결

### 자주 발생하는 문제

1. **연결 오류**

   ```
   Failed to fetch from Supabase
   ```

   - Supabase URL과 API 키 확인
   - 네트워크 연결 확인
   - RLS 정책 확인

2. **권한 오류**

   ```
   insufficient_privilege
   ```

   - Service Role 키 사용 확인
   - RLS 정책 재검토

3. **유효성 검증 오류**
   ```
   Validation failed
   ```
   - 필수 필드 누락 확인
   - 데이터 형식 확인

### 디버깅

1. **로그 확인**

```bash
# 서버 로그
npm run dev

# 데이터베이스 로그
# Supabase Dashboard > Logs 탭에서 확인
```

2. **API 테스트**

```bash
# 전체 API 테스트
npm run test:api

# 개별 엔드포인트 테스트
curl -X POST http://localhost:3000/api/consultation-submit \
  -H "Content-Type: application/json" \
  -d @test-data.json
```

## 📞 지원

문제가 발생하거나 추가 기능이 필요한 경우:

1. **이슈 생성**: GitHub Issues에 문제 상황 등록
2. **로그 첨부**: 오류 메시지와 관련 로그 포함
3. **환경 정보**: OS, Node.js 버전, 브라우저 정보 제공

## 🔄 업데이트 가이드

### 데이터베이스 스키마 변경

1. **마이그레이션 파일 생성**

```sql
-- supabase/migrations/002_add_new_feature.sql
ALTER TABLE consultations ADD COLUMN new_field TEXT;
```

2. **마이그레이션 적용**

```bash
supabase db push
```

### API 버전 관리

- 호환성이 깨지는 변경사항은 새로운 엔드포인트로 구현
- 기존 엔드포인트는 deprecated 표시 후 일정 기간 후 제거
- API 버전 헤더를 통한 버전 관리 고려

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.
