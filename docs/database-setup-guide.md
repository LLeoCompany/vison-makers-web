# LeoFitTech 데이터베이스 설정 가이드

## 오류 상황

상담 신청 API에서 다음 오류가 발생하고 있습니다:

```
SupabaseError: Could not find the table 'public.consultations' in the schema cache
```

## 해결 방법

### 1. Supabase 프로젝트에 데이터베이스 스키마 생성

Supabase Dashboard에서 다음 순서로 실행하세요:

#### Step 1: SQL Editor에서 스키마 실행

1. Supabase Dashboard 로그인
2. SQL Editor 메뉴로 이동
3. 아래 스키마 파일들을 순서대로 실행

#### Step 2: 스키마 파일 실행 순서

1. **001_initial_schema.sql** - 기본 테이블 및 구조 생성
2. **002_rls_policies.sql** - 행 레벨 보안 정책 설정
3. **003_initial_data.sql** - 초기 데이터 및 관리자 계정 생성

### 2. 환경변수 확인

`.env.local` 파일에 다음 환경변수들이 설정되어 있는지 확인:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 테이블 생성 확인

SQL Editor에서 다음 쿼리로 테이블이 정상 생성되었는지 확인:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('consultations', 'guided_consultations', 'free_consultations');
```

예상 결과:

```
consultations
guided_consultations
free_consultations
```

### 4. 스키마 상세 정보

#### 메인 테이블 구조:

**consultations (상담 기본 정보)**

- id (UUID, Primary Key)
- consultation_number (상담 번호)
- type (guided/free)
- status (pending/contacted/in_progress/completed/cancelled)
- contact\_\* (연락처 정보)

**guided_consultations (가이드 상담 세부사항)**

- consultation_id (FK to consultations)
- service_type (서비스 유형)
- project_size, budget, timeline
- important_features (기능 요구사항)

**free_consultations (자유 상담 세부사항)**

- consultation_id (FK to consultations)
- project_description (프로젝트 설명)
- budget_range, timeline_preference

## 트러블슈팅

### 문제 1: 테이블이 생성되지 않음

- SQL Editor에서 에러 메시지 확인
- RLS 정책 때문에 접근이 제한될 수 있음
- Service Role Key로 접근하는지 확인

### 문제 2: 권한 오류

- Supabase Service Role Key가 올바른지 확인
- RLS 정책이 올바르게 설정되었는지 확인

### 문제 3: 캐시 문제

- Supabase Dashboard에서 "Refresh Schema Cache" 실행
- 또는 잠시 기다린 후 다시 시도

## 현재 상태 확인

다음 명령으로 API가 정상 작동하는지 테스트:

```bash
curl -X POST http://localhost:3002/api/consultation-submit \
  -H "Content-Type: application/json" \
  -d '{
    "type": "free",
    "name": "테스트",
    "email": "test@example.com",
    "phone": "010-1234-5678",
    "projectDescription": "테스트 프로젝트"
  }'
```

정상 응답:

```json
{
  "success": true,
  "data": {
    "consultationId": "uuid",
    "consultationNumber": "CONS-YYYYMMDD-001"
  }
}
```
