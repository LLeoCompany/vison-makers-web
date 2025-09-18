-- VisionMakers 초기 데이터 삽입
-- Supabase Dashboard > SQL Editor에서 실행

-- ==========================================
-- 1. 시스템 설정 초기값
-- ==========================================

INSERT INTO system_configs (config_key, config_value, config_type, description, category, is_public) VALUES
-- 일반 설정
('site_title', '"VisionMakers"', 'string', '사이트 제목', 'general', true),
('site_description', '"VisionMakers는 혁신적인 디지털 솔루션을 제공합니다"', 'string', '사이트 설명', 'general', true),
('company_name', '"VisionMakers Co., Ltd."', 'string', '회사명', 'general', true),

-- 연락처 정보
('contact_email', '"info@visionmakers.com"', 'string', '연락처 이메일', 'contact', true),
('contact_phone', '"02-1234-5678"', 'string', '연락처 전화번호', 'contact', true),
('contact_address', '"서울특별시 강남구 테헤란로 123"', 'string', '회사 주소', 'contact', true),
('business_hours', '{"start": "09:00", "end": "18:00", "timezone": "Asia/Seoul", "weekdays": [1,2,3,4,5]}', 'json', '영업 시간', 'contact', true),

-- 시스템 설정
('max_file_size', '10485760', 'number', '최대 파일 크기 (bytes) - 10MB', 'upload', false),
('allowed_file_types', '["jpg", "jpeg", "png", "pdf", "doc", "docx"]', 'array', '허용된 파일 타입', 'upload', false),
('maintenance_mode', 'false', 'boolean', '점검 모드 활성화', 'system', false),
('api_rate_limit_enabled', 'true', 'boolean', 'API 레이트 리미트 활성화', 'system', false),

-- 상담 관련 설정
('consultation_auto_assign', 'true', 'boolean', '상담 자동 배정 활성화', 'consultation', false),
('consultation_response_time_hours', '24', 'number', '상담 응답 목표 시간 (시간)', 'consultation', false),
('max_consultations_per_email', '3', 'number', '이메일당 최대 상담 신청 수', 'consultation', false),

-- 보안 설정
('rate_limit_consultation_submit', '3', 'number', '상담 신청 레이트 리미트 (10분당)', 'security', false),
('rate_limit_api_general', '100', 'number', '일반 API 레이트 리미트 (분당)', 'security', false),
('session_timeout_hours', '24', 'number', '세션 타임아웃 (시간)', 'security', false),
('password_min_length', '8', 'number', '비밀번호 최소 길이', 'security', false),
('failed_login_max_attempts', '5', 'number', '로그인 실패 최대 시도 횟수', 'security', false),
('account_lockout_duration_minutes', '30', 'number', '계정 잠금 지속 시간 (분)', 'security', false),

-- 알림 설정
('email_notifications_enabled', 'true', 'boolean', '이메일 알림 활성화', 'notification', false),
('admin_notification_email', '"admin@visionmakers.com"', 'string', '관리자 알림 이메일', 'notification', false),
('new_consultation_notification', 'true', 'boolean', '새 상담 알림', 'notification', false),
('status_change_notification', 'true', 'boolean', '상태 변경 알림', 'notification', false),

-- 국제화 설정
('default_language', '"ko"', 'string', '기본 언어', 'i18n', true),
('supported_languages', '["ko", "en"]', 'array', '지원 언어 목록', 'i18n', true),
('timezone', '"Asia/Seoul"', 'string', '기본 시간대', 'i18n', true),

-- 성능 설정
('cache_enabled', 'true', 'boolean', '캐시 활성화', 'performance', false),
('cache_ttl_seconds', '300', 'number', '캐시 TTL (초)', 'performance', false),
('database_query_timeout_ms', '30000', 'number', '데이터베이스 쿼리 타임아웃 (밀리초)', 'performance', false),

-- 모니터링 설정
('monitoring_enabled', 'true', 'boolean', '모니터링 활성화', 'monitoring', false),
('performance_tracking_enabled', 'true', 'boolean', '성능 추적 활성화', 'monitoring', false),
('error_reporting_enabled', 'true', 'boolean', '에러 리포팅 활성화', 'monitoring', false),
('log_retention_days', '90', 'number', '로그 보관 기간 (일)', 'monitoring', false),

-- API 설정
('api_version_default', '"v1"', 'string', 'API 기본 버전', 'api', false),
('api_version_latest', '"v2"', 'string', 'API 최신 버전', 'api', false),
('api_cors_origins', '["http://localhost:3000", "https://visionmakers.com"]', 'array', 'CORS 허용 도메인', 'api', false),
('api_documentation_url', '"https://docs.visionmakers.com"', 'string', 'API 문서 URL', 'api', true);

-- ==========================================
-- 2. 기본 관리자 계정 생성
-- ==========================================

-- 기본 시스템 관리자 (임시 계정, 운영 시 변경 필요)
-- 사용자명: admin
-- 이메일: admin@visionmakers.com
-- 비밀번호: VisionMakers2024! (bcrypt 해시)
INSERT INTO admin_users (
    username,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    is_verified,
    permissions,
    department,
    position
) VALUES (
    'admin',
    'admin@visionmakers.com',
    '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- VisionMakers2024!
    '시스템 관리자',
    'admin',
    true,
    true,
    ARRAY['readAccess', 'writeAccess', 'deleteAccess', 'adminOnly', 'statsAccess'],
    'IT',
    'System Administrator'
);

-- 매니저 계정 (임시)
-- 사용자명: manager
-- 이메일: manager@visionmakers.com
-- 비밀번호: Manager2024! (bcrypt 해시)
INSERT INTO admin_users (
    username,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    is_verified,
    permissions,
    department,
    position
) VALUES (
    'manager',
    'manager@visionmakers.com',
    '$2b$12$E9rQqPW1YjzK8.Z3XuKUWeQFGy9tZf8s7iJ5q1K9rEGHl6A4gA8XC', -- Manager2024!
    '서비스 매니저',
    'manager',
    true,
    true,
    ARRAY['readAccess', 'writeAccess', 'statsAccess'],
    'Sales',
    'Service Manager'
);

-- 뷰어 계정 (임시)
-- 사용자명: viewer
-- 이메일: viewer@visionmakers.com
-- 비밀번호: Viewer2024! (bcrypt 해시)
INSERT INTO admin_users (
    username,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    is_verified,
    permissions,
    department,
    position
) VALUES (
    'viewer',
    'viewer@visionmakers.com',
    '$2b$12$8h9QKsF2NvY3GqI8RjW7.eUZKv1PtJ4mV7nQ0sL6bC3fE9rG5aH2D', -- Viewer2024!
    '데이터 뷰어',
    'viewer',
    true,
    true,
    ARRAY['readAccess', 'statsAccess'],
    'Analytics',
    'Data Analyst'
);

-- ==========================================
-- 3. 샘플 상담 데이터 (선택적 - 테스트용)
-- ==========================================

-- 샘플 가이드 상담
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
    utm_source,
    utm_medium,
    utm_campaign,
    ip_address
) VALUES
(
    'CON-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    'guided',
    'pending',
    'normal',
    '홍길동',
    '010-1234-5678',
    'hong@example.com',
    '테스트 회사',
    'morning',
    'google',
    'cpc',
    'web_development_2024',
    '127.0.0.1'
),
(
    'CON-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-002',
    'guided',
    'contacted',
    'high',
    '김철수',
    '010-9876-5432',
    'kim@example.com',
    '혁신 스타트업',
    'afternoon',
    'naver',
    'organic',
    'mobile_app_2024',
    '127.0.0.2'
);

-- 위 상담들에 대한 가이드 상담 세부사항
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
    c.id,
    'web_development',
    'medium',
    '3000_to_5000',
    '3_6_months',
    ARRAY['responsive_design', 'cms', 'seo_optimization'],
    '반응형 웹사이트와 관리자 패널이 필요합니다.'
FROM consultations c
WHERE c.consultation_number LIKE 'CON-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001';

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
    c.id,
    'mobile_app',
    'large',
    '5000_to_10000',
    '6_12_months',
    ARRAY['cross_platform', 'push_notifications', 'offline_support', 'payment_integration'],
    '크로스 플랫폼 모바일 앱과 결제 시스템 통합이 필요합니다.'
FROM consultations c
WHERE c.consultation_number LIKE 'CON-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-002';

-- 샘플 자유 상담
INSERT INTO consultations (
    consultation_number,
    type,
    status,
    priority,
    contact_name,
    contact_phone,
    contact_email,
    preferred_contact_time
) VALUES
(
    'CON-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-003',
    'free',
    'in_progress',
    'normal',
    '이영희',
    '010-5555-7777',
    'lee@example.com',
    'evening'
);

INSERT INTO free_consultations (
    consultation_id,
    project_description,
    budget_range,
    timeline_preference
)
SELECT
    c.id,
    '온라인 쇼핑몰 구축을 원합니다. 상품 등록, 주문 관리, 결제 시스템이 포함된 전자상거래 플랫폼이 필요합니다. WordPress나 Shopify 같은 기존 솔루션보다는 맞춤형 개발을 선호합니다.',
    '500-1000만원 내외',
    '6개월 이내 완성 희망'
FROM consultations c
WHERE c.consultation_number LIKE 'CON-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-003';

-- ==========================================
-- 4. 초기 통계 데이터 생성
-- ==========================================

-- 오늘 날짜의 통계 초기화
INSERT INTO consultation_stats (
    date,
    total_submissions,
    guided_submissions,
    free_submissions,
    completed_consultations,
    pending_consultations,
    cancelled_consultations,
    conversion_rate,
    avg_response_time_hours
)
SELECT
    CURRENT_DATE,
    COUNT(*),
    COUNT(*) FILTER (WHERE type = 'guided'),
    COUNT(*) FILTER (WHERE type = 'free'),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'pending'),
    COUNT(*) FILTER (WHERE status = 'cancelled'),
    CASE
        WHEN COUNT(*) > 0 THEN
            COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)
        ELSE 0
    END,
    0 -- 평균 응답 시간은 시간이 지나면서 계산됨
FROM consultations
WHERE created_at::DATE = CURRENT_DATE;

-- ==========================================
-- 5. 데이터 검증 쿼리
-- ==========================================

-- 생성된 데이터 확인
DO $$
DECLARE
    config_count INTEGER;
    admin_count INTEGER;
    consultation_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO config_count FROM system_configs;
    SELECT COUNT(*) INTO admin_count FROM admin_users;
    SELECT COUNT(*) INTO consultation_count FROM consultations;

    RAISE NOTICE '초기 데이터 생성 완료:';
    RAISE NOTICE '- 시스템 설정: % 개', config_count;
    RAISE NOTICE '- 관리자 계정: % 개', admin_count;
    RAISE NOTICE '- 샘플 상담: % 개', consultation_count;

    -- 기본 검증
    IF config_count < 30 THEN
        RAISE EXCEPTION '시스템 설정이 충분히 생성되지 않았습니다.';
    END IF;

    IF admin_count < 3 THEN
        RAISE EXCEPTION '관리자 계정이 충분히 생성되지 않았습니다.';
    END IF;

    RAISE NOTICE '✅ 모든 초기 데이터가 성공적으로 생성되었습니다.';
END $$;

-- ==========================================
-- 6. 보안 알림
-- ==========================================

-- 기본 관리자 계정 보안 경고
INSERT INTO consultation_logs (
    consultation_id,
    action,
    actor_type,
    details
)
SELECT
    NULL,
    'note_added',
    'system',
    jsonb_build_object(
        'type', 'security_warning',
        'message', '기본 관리자 계정들이 생성되었습니다. 운영 전에 반드시 비밀번호를 변경하거나 계정을 삭제해주세요.',
        'accounts', jsonb_build_array('admin@visionmakers.com', 'manager@visionmakers.com', 'viewer@visionmakers.com'),
        'priority', 'high'
    );