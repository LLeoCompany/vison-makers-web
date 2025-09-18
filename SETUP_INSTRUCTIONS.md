# 🚀 VisionMakers Supabase 설정 단계별 가이드

## ✅ 1단계: 연결 확인 완료
- Supabase 연결: ✅ 성공
- 환경 변수 설정: ✅ 완료
- 의존성 설치: ✅ 완료

## 📝 2단계: SQL 스키마 실행 (지금 해야 할 작업)

### 1. Supabase Dashboard 접속
1. 브라우저에서 [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 `nwnxbhkaoydiomjnjzdk` 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭

### 2. SQL 스크립트 실행 (순서대로!)

#### A. 첫 번째: 기본 스키마 생성
1. **New Query** 버튼 클릭
2. `sql/001_initial_schema.sql` 파일의 모든 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭
4. 실행 완료 확인 (약 1-2분 소요)

#### B. 두 번째: RLS 정책 설정
1. **New Query** 버튼 클릭
2. `sql/002_rls_policies.sql` 파일의 모든 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭
4. 실행 완료 확인

#### C. 세 번째: 초기 데이터 삽입
1. **New Query** 버튼 클릭
2. `sql/003_initial_data.sql` 파일의 모든 내용을 복사하여 붙여넣기
3. **Run** 버튼 클릭
4. 실행 완료 확인

### 3. 스키마 생성 확인
SQL Editor에서 다음 쿼리를 실행하여 테이블이 생성되었는지 확인:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**예상 결과:** 9개 테이블이 보여야 합니다:
- admin_users
- api_logs
- consultation_logs
- consultation_stats
- consultations
- free_consultations
- guided_consultations
- system_configs
- user_sessions

## 🧪 3단계: API 테스트 준비

스키마 실행이 완료되면 다음 명령어로 연결 상태를 다시 확인하세요:

```bash
node scripts/test-connection.js
```

**기대 결과:**
```
✅ Connection successful!
✅ VisionMakers schema exists!
📊 Found consultations table with 3 records
```

## 🎯 현재 상태 요약

| 단계 | 상태 | 설명 |
|------|------|------|
| 환경 설정 | ✅ 완료 | .env.local 파일 생성됨 |
| 의존성 설치 | ✅ 완료 | @supabase/supabase-js 설치됨 |
| 연결 테스트 | ✅ 성공 | Supabase 서버 연결 확인됨 |
| 스키마 생성 | ⏳ **진행 필요** | SQL 스크립트 실행 필요 |
| API 테스트 | ⏸️ 대기중 | 스키마 완료 후 진행 |

## 🔗 유용한 링크

- [Supabase Dashboard](https://app.supabase.com/project/nwnxbhkaoydiomjnjzdk)
- [SQL Editor](https://app.supabase.com/project/nwnxbhkaoydiomjnjzdk/sql)
- [테이블 뷰어](https://app.supabase.com/project/nwnxbhkaoydiomjnjzdk/editor)

## ⚡ 다음 단계 미리보기

스키마 생성이 완료되면:
1. **상담 신청 테스트** - 샘플 상담 데이터 생성
2. **관리자 로그인 테스트** - 기본 계정으로 로그인 확인
3. **실제 API 연동** - React 컴포넌트와 연결
4. **대시보드 테스트** - 관리자 대시보드 기능 확인

---

💡 **문제가 발생하면:** 각 SQL 스크립트를 개별적으로 실행하고, 오류 메시지를 확인하세요. 대부분의 오류는 순서를 잘못 실행했거나 이전 실행이 완료되지 않았을 때 발생합니다.