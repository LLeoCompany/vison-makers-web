# VisionMakers Database Setup Guide

## 📋 개요

VisionMakers API 시스템을 위한 Supabase 데이터베이스 스키마 설정 가이드입니다.

## 🚀 빠른 시작

### 1. Supabase 프로젝트 설정

1. **Supabase 대시보드** (https://app.supabase.com) 접속
2. **새 프로젝트 생성** 또는 기존 프로젝트 선택
3. **SQL Editor** 메뉴로 이동

### 2. 스키마 마이그레이션 실행

다음 순서대로 SQL 파일들을 실행합니다:

```sql
-- 1. 기본 스키마 생성
-- sql/001_initial_schema.sql 파일의 내용을 복사하여 실행

-- 2. RLS 정책 설정
-- sql/002_rls_policies.sql 파일의 내용을 복사하여 실행

-- 3. 초기 데이터 삽입
-- sql/003_initial_data.sql 파일의 내용을 복사하여 실행
```

### 3. 환경 변수 설정

`.env.local` 파일에 다음 변수들을 설정합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT 설정
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 기타 설정
LOG_LEVEL=info
NODE_ENV=development
```

## 📊 스키마 구조

### 핵심 테이블

| 테이블명 | 목적 | 주요 필드 |
|----------|------|-----------|
| `consultations` | 메인 상담 데이터 | id, consultation_number, type, status |
| `guided_consultations` | 가이드 상담 세부사항 | service_type, budget, timeline |
| `free_consultations` | 자유 상담 세부사항 | project_description |
| `admin_users` | 관리자 계정 | username, email, role, permissions |
| `user_sessions` | 세션 관리 | access_token_hash, refresh_token_hash |
| `consultation_logs` | 활동 로그 | action, old_values, new_values |
| `api_logs` | API 호출 로그 | endpoint, status_code, response_time_ms |
| `system_configs` | 시스템 설정 | config_key, config_value |
| `consultation_stats` | 일별 통계 | date, total_submissions, conversion_rate |

### 뷰 (Views)

| 뷰명 | 목적 |
|------|------|
| `consultation_details` | 상담 상세 정보 통합 뷰 |
| `consultation_status_counts` | 상태별 카운트 집계 |

## 🔐 보안 설정

### Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있으며, 다음 원칙을 따릅니다:

- **공개 API**: 상담 신청만 허용 (`anon` 역할)
- **인증된 사용자**: 관리자 계정으로 로그인한 경우
- **역할 기반 접근**: admin > manager > viewer 순 권한

### 기본 계정

| 역할 | 사용자명 | 이메일 | 기본 비밀번호 |
|------|----------|--------|---------------|
| admin | admin | admin@visionmakers.com | VisionMakers2024! |
| manager | manager | manager@visionmakers.com | Manager2024! |
| viewer | viewer | viewer@visionmakers.com | Viewer2024! |

⚠️ **보안 경고**: 운영 환경 배포 전에 반드시 기본 비밀번호를 변경하세요!

## 🔧 주요 함수

### 자동 실행 함수

- `update_updated_at_column()` - updated_at 필드 자동 업데이트
- `log_consultation_changes()` - 상담 변경사항 자동 로깅
- `update_daily_stats()` - 일별 통계 자동 업데이트

### 보안 함수

- `is_admin(user_uuid)` - 관리자 권한 확인
- `has_permission(permission_name, user_uuid)` - 권한 확인
- `can_access_consultation(consultation_uuid, user_uuid)` - 상담 접근 권한 확인

## 📈 성능 최적화

### 인덱스 전략

1. **기본 인덱스**: 모든 외래키와 자주 검색되는 필드
2. **복합 인덱스**: UTM 파라미터, 날짜 범위 검색
3. **GIN 인덱스**: JSONB 필드 (metadata, important_features)
4. **부분 인덱스**: 활성 사용자, 유효한 세션

### 쿼리 최적화

```sql
-- 좋은 예: 인덱스 활용
SELECT * FROM consultations
WHERE status = 'pending'
  AND created_at >= '2024-01-01'
ORDER BY created_at DESC;

-- 피할 것: 풀 테이블 스캔
SELECT * FROM consultations
WHERE LOWER(contact_name) LIKE '%김%';
```

## 🔄 데이터 마이그레이션

### 기존 시스템에서 이전

```sql
-- 1. 기존 데이터 백업
pg_dump old_database > backup.sql

-- 2. 데이터 변환 스크립트 실행
-- (필요에 따라 custom migration script 작성)

-- 3. 데이터 검증
SELECT COUNT(*) FROM consultations;
SELECT COUNT(*) FROM admin_users;
```

### 롤백 절차

```sql
-- 긴급 롤백이 필요한 경우
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- 백업에서 복원
```

## 🛠️ 유지보수

### 정기 작업

```sql
-- 1. 만료된 세션 정리 (일일)
DELETE FROM user_sessions
WHERE expires_at < NOW() OR is_active = false;

-- 2. 오래된 로그 아카이브 (주간)
DELETE FROM api_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- 3. 통계 재계산 (월간)
CALL refresh_consultation_stats();
```

### 모니터링 쿼리

```sql
-- 성능 모니터링
SELECT
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;

-- 슬로우 쿼리 확인
SELECT
    query,
    mean_exec_time,
    calls,
    total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 🚨 트러블슈팅

### 자주 발생하는 문제

#### 1. RLS 정책 오류

```
ERROR: new row violates row-level security policy
```

**해결방법**: Service Role 사용하거나 적절한 정책 추가

#### 2. 외래키 제약 위반

```
ERROR: insert or update on table violates foreign key constraint
```

**해결방법**: 참조되는 레코드가 먼저 존재하는지 확인

#### 3. JSON 형식 오류

```
ERROR: invalid input syntax for type json
```

**해결방법**: JSON 데이터 검증 및 적절한 형식으로 변환

### 디버깅 팁

```sql
-- 1. 테이블 용량 확인
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 2. 인덱스 사용률 확인
SELECT
    indexrelname as index_name,
    idx_tup_read,
    idx_tup_fetch,
    idx_tup_read + idx_tup_fetch as total_reads
FROM pg_stat_user_indexes
ORDER BY total_reads DESC;

-- 3. 락 확인
SELECT
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity
    ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks
    ON blocking_locks.locktype = blocked_locks.locktype
WHERE NOT blocked_locks.granted;
```

## 📚 추가 리소스

### 공식 문서

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

### 유용한 도구

- **pgAdmin**: PostgreSQL 관리 도구
- **DBeaver**: 범용 데이터베이스 클라이언트
- **Supabase CLI**: 로컬 개발 환경 관리

---

## ⚠️ 중요 보안 체크리스트

### 배포 전 필수 확인사항

- [ ] 기본 관리자 비밀번호 변경
- [ ] JWT_SECRET 32자 이상 랜덤 문자열 설정
- [ ] RLS 정책 활성화 확인
- [ ] Service Role Key 보안 관리
- [ ] CORS 설정 검토
- [ ] 환경 변수 노출 방지
- [ ] 백업 전략 수립

### 운영 중 주기적 점검

- [ ] 보안 패치 적용
- [ ] 사용자 권한 검토
- [ ] 로그 모니터링
- [ ] 성능 메트릭 확인
- [ ] 데이터 백업 검증

---

*마지막 업데이트: 2024년 12월 17일*