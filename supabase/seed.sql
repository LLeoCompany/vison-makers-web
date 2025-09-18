-- VisionMakers 상담시스템 시드 데이터
-- 개발 및 테스트용 샘플 데이터

-- 1. 샘플 상담 신청 데이터 생성
-- 가이드 상담 샘플
INSERT INTO consultations (
  consultation_number,
  type,
  status,
  priority,
  contact_name,
  contact_phone,
  contact_email,
  contact_company,
  preferred_contact_time,
  user_agent,
  ip_address,
  utm_source,
  utm_medium,
  utm_campaign,
  created_at
) VALUES
(
  'CS-20240917-0001',
  'guided',
  'pending',
  'normal',
  '김철수',
  '010-1234-5678',
  'kim@example.com',
  '테크스타트업',
  'afternoon',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  '192.168.1.1',
  'google',
  'cpc',
  'homepage_campaign',
  NOW() - INTERVAL '2 hours'
),
(
  'CS-20240917-0002',
  'guided',
  'reviewing',
  'high',
  '이영희',
  '010-9876-5432',
  'lee@company.co.kr',
  '이커머스솔루션',
  'morning',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  '192.168.1.2',
  'naver',
  'organic',
  null,
  NOW() - INTERVAL '1 day'
),
(
  'CS-20240916-0001',
  'free',
  'contacted',
  'urgent',
  '박민수',
  '010-5555-1234',
  'park@startup.io',
  '핀테크스타트업',
  'evening',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1',
  '192.168.1.3',
  'facebook',
  'social',
  'mobile_campaign',
  NOW() - INTERVAL '2 days'
),
(
  'CS-20240915-0001',
  'guided',
  'completed',
  'normal',
  '정미래',
  '010-7777-8888',
  'jung@future.com',
  '미래기술',
  'anytime',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
  '192.168.1.4',
  'google',
  'organic',
  null,
  NOW() - INTERVAL '3 days'
);

-- 2. 가이드 상담 상세 정보
INSERT INTO guided_consultations (
  consultation_id,
  service_type,
  project_size,
  budget,
  timeline,
  important_features,
  additional_requests
)
SELECT
  id,
  CASE
    WHEN consultation_number = 'CS-20240917-0001' THEN 'homepage'
    WHEN consultation_number = 'CS-20240917-0002' THEN 'shopping'
    WHEN consultation_number = 'CS-20240915-0001' THEN 'booking'
  END,
  CASE
    WHEN consultation_number = 'CS-20240917-0001' THEN 'small'
    WHEN consultation_number = 'CS-20240917-0002' THEN 'large'
    WHEN consultation_number = 'CS-20240915-0001' THEN 'medium'
  END,
  CASE
    WHEN consultation_number = 'CS-20240917-0001' THEN '300-800'
    WHEN consultation_number = 'CS-20240917-0002' THEN '1500+'
    WHEN consultation_number = 'CS-20240915-0001' THEN '800-1500'
  END,
  CASE
    WHEN consultation_number = 'CS-20240917-0001' THEN '2-3months'
    WHEN consultation_number = 'CS-20240917-0002' THEN '6months'
    WHEN consultation_number = 'CS-20240915-0001' THEN '1month'
  END,
  CASE
    WHEN consultation_number = 'CS-20240917-0001' THEN '["mobile", "seo"]'::jsonb
    WHEN consultation_number = 'CS-20240917-0002' THEN '["mobile", "seo", "admin", "payment"]'::jsonb
    WHEN consultation_number = 'CS-20240915-0001' THEN '["mobile", "admin"]'::jsonb
  END,
  CASE
    WHEN consultation_number = 'CS-20240917-0001' THEN '반응형 웹사이트로 제작하고 싶습니다. SEO 최적화도 중요합니다.'
    WHEN consultation_number = 'CS-20240917-0002' THEN '대용량 상품 관리가 가능한 쇼핑몰이 필요합니다. 결제 모듈 연동도 필요합니다.'
    WHEN consultation_number = 'CS-20240915-0001' THEN '실시간 예약 시스템과 알림 기능이 필요합니다.'
  END
FROM consultations
WHERE type = 'guided';

-- 3. 자유 상담 상세 정보
INSERT INTO free_consultations (
  consultation_id,
  project_description,
  budget_range,
  timeline_preference
)
SELECT
  id,
  '핀테크 서비스를 위한 웹 플랫폼 개발을 계획하고 있습니다. 사용자가 금융 데이터를 시각화하고 투자 포트폴리오를 관리할 수 있는 대시보드가 필요합니다. 보안이 매우 중요하며, 실시간 데이터 처리와 차트 기능이 핵심입니다. React와 TypeScript를 선호하고, 백엔드는 Node.js나 Python을 고려하고 있습니다.',
  '2000만원 내외',
  '4-5개월 정도 예상'
FROM consultations
WHERE consultation_number = 'CS-20240916-0001';

-- 4. 상담 로그 데이터
INSERT INTO consultation_logs (consultation_id, action, details, notes, actor_type, created_at)
SELECT
  c.id,
  'created',
  jsonb_build_object(
    'type', c.type,
    'ip_address', c.ip_address::text,
    'user_agent_info', jsonb_build_object('browser', 'Chrome', 'os', 'Windows', 'device', 'desktop')
  ),
  '새로운 상담 신청이 접수되었습니다.',
  'system',
  c.created_at
FROM consultations c;

-- 검토 시작 로그 (reviewing 상태인 경우)
INSERT INTO consultation_logs (consultation_id, action, details, notes, actor_type, created_at)
SELECT
  c.id,
  'status_changed',
  jsonb_build_object(
    'old_status', 'pending',
    'new_status', 'reviewing'
  ),
  '상담 검토를 시작했습니다.',
  'admin',
  c.created_at + INTERVAL '1 hour'
FROM consultations c
WHERE c.status IN ('reviewing', 'contacted', 'completed');

-- 연락 완료 로그
INSERT INTO consultation_logs (consultation_id, action, details, notes, actor_type, created_at)
SELECT
  c.id,
  'status_changed',
  jsonb_build_object(
    'old_status', 'reviewing',
    'new_status', 'contacted'
  ),
  '고객에게 연락을 완료했습니다.',
  'admin',
  c.created_at + INTERVAL '4 hours'
FROM consultations c
WHERE c.status IN ('contacted', 'completed');

-- 상담 완료 로그
INSERT INTO consultation_logs (consultation_id, action, details, notes, actor_type, created_at)
SELECT
  c.id,
  'status_changed',
  jsonb_build_object(
    'old_status', 'contacted',
    'new_status', 'completed'
  ),
  '상담이 성공적으로 완료되었습니다.',
  'admin',
  c.created_at + INTERVAL '1 day'
FROM consultations c
WHERE c.status = 'completed';

-- 5. 통계 데이터 생성 (최근 7일)
INSERT INTO consultation_stats (date, total_submissions, guided_submissions, free_submissions, page_views, form_starts, form_completions, source_stats)
VALUES
(CURRENT_DATE, 2, 2, 0, 150, 12, 2, '{"google": 1, "naver": 1}'::jsonb),
(CURRENT_DATE - INTERVAL '1 day', 1, 0, 1, 120, 8, 1, '{"facebook": 1}'::jsonb),
(CURRENT_DATE - INTERVAL '2 days', 1, 1, 0, 180, 15, 1, '{"google": 1}'::jsonb),
(CURRENT_DATE - INTERVAL '3 days', 3, 2, 1, 200, 20, 3, '{"google": 2, "direct": 1}'::jsonb),
(CURRENT_DATE - INTERVAL '4 days', 0, 0, 0, 90, 5, 0, '{}'::jsonb),
(CURRENT_DATE - INTERVAL '5 days', 2, 1, 1, 160, 18, 2, '{"naver": 1, "google": 1}'::jsonb),
(CURRENT_DATE - INTERVAL '6 days', 1, 1, 0, 140, 10, 1, '{"google": 1}'::jsonb);

-- 6. 함수 테스트
-- 상담번호 생성 함수 테스트
SELECT generate_consultation_number() as test_consultation_number;

-- 7. 권한 확인용 더미 데이터 (개발용)
-- 실제 운영에서는 제거할 것

-- 상담 상태 분포 확인
SELECT
  status,
  COUNT(*) as count,
  ROUND((COUNT(*)::FLOAT / (SELECT COUNT(*) FROM consultations)) * 100, 2) as percentage
FROM consultations
GROUP BY status
ORDER BY count DESC;

-- 타입별 분포 확인
SELECT
  type,
  COUNT(*) as count,
  ROUND((COUNT(*)::FLOAT / (SELECT COUNT(*) FROM consultations)) * 100, 2) as percentage
FROM consultations
GROUP BY type;

-- 최근 통계 확인
SELECT * FROM daily_stats_summary ORDER BY date DESC LIMIT 7;

-- 상담 상세 뷰 테스트
SELECT * FROM consultation_details ORDER BY created_at DESC LIMIT 3;