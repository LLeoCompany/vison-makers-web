-- LeoFitTech 최적화된 데이터베이스 스키마
-- 설계 이론 기반 완전 재설계 버전

-- ==========================================
-- 1. 스키마 및 확장 생성
-- ==========================================

-- 도메인별 스키마 생성 (DDD 패턴)
CREATE SCHEMA IF NOT EXISTS consultation_domain;
CREATE SCHEMA IF NOT EXISTS user_domain;
CREATE SCHEMA IF NOT EXISTS system_domain;
CREATE SCHEMA IF NOT EXISTS analytics_domain;

-- 필요한 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ==========================================
-- 2. 개선된 ENUM 및 참조 테이블 생성
-- ==========================================

-- 상담 상태 (확장 가능한 참조 테이블 패턴)
CREATE TABLE consultation_domain.statuses (
code VARCHAR(50) PRIMARY KEY,
display_name JSONB NOT NULL,
description TEXT,
sort_order INTEGER DEFAULT 0,
is_final BOOLEAN DEFAULT FALSE, -- 최종 상태 여부
allows_transition_to TEXT[] DEFAULT '{}', -- 허용되는 다음 상태들
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 기본 상태 데이터
INSERT INTO consultation_domain.statuses (code, display_name, sort_order, is_final, allows_transition_to) VALUES
('pending', '{"ko": "대기중", "en": "Pending"}', 1, false, ARRAY['contacted', 'cancelled']),
('contacted', '{"ko": "연락완료", "en": "Contacted"}', 2, false, ARRAY['in_progress', 'cancelled']),
('in_progress', '{"ko": "진행중", "en": "In Progress"}', 3, false, ARRAY['completed', 'on_hold', 'cancelled']),
('on_hold', '{"ko": "보류", "en": "On Hold"}', 4, false, ARRAY['in_progress', 'cancelled']),
('completed', '{"ko": "완료", "en": "Completed"}', 5, true, ARRAY[]::TEXT[]),
('cancelled', '{"ko": "취소", "en": "Cancelled"}', 6, true, ARRAY[]::TEXT[]);

-- 상담 타입 (확장 가능한 참조 테이블)
CREATE TABLE consultation_domain.types (
code VARCHAR(50) PRIMARY KEY,
display_name JSONB NOT NULL,
description TEXT,
is_active BOOLEAN DEFAULT TRUE,
sort_order INTEGER DEFAULT 0,
config JSONB DEFAULT '{}', -- 타입별 설정
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

INSERT INTO consultation_domain.types (code, display_name, sort_order, config) VALUES
('guided', '{"ko": "가이드 상담", "en": "Guided Consultation"}', 1, '{"requires_service_type": true, "requires_budget": true}'),
('free', '{"ko": "자유 상담", "en": "Free Consultation"}', 2, '{"requires_description": true}');

-- 우선순위 (ENUM 유지 - 변경 빈도 낮음)
CREATE TYPE consultation_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- 연락 선호 시간
CREATE TYPE contact_time_preference AS ENUM ('morning', 'afternoon', 'evening', 'anytime');

-- ==========================================
-- 3. 핵심 도메인 테이블 (개선된 설계)
-- ==========================================

-- 상담 핵심 정보 (SRP 원칙 적용)
CREATE TABLE consultation_domain.consultations (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
consultation_number VARCHAR(50) NOT NULL UNIQUE,

    -- 기본 정보
    type_code VARCHAR(50) NOT NULL REFERENCES consultation_domain.types(code),
    status_code VARCHAR(50) DEFAULT 'pending' NOT NULL REFERENCES consultation_domain.statuses(code),
    priority consultation_priority DEFAULT 'normal' NOT NULL,

    -- 타임스탬프 (이벤트 소싱 준비)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- 상태 변경 추적
    status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    contacted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- 담당자 (외래키 지연)
    assigned_to UUID, -- 나중에 외래키 제약 추가

    -- 소프트 삭제
    is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID,

    -- 버전 관리 (낙관적 동시성 제어)
    version INTEGER DEFAULT 1 NOT NULL,

    CONSTRAINT valid_deleted_state CHECK (
        (is_deleted = FALSE AND deleted_at IS NULL) OR
        (is_deleted = TRUE AND deleted_at IS NOT NULL)
    ),
    CONSTRAINT valid_status_transition CHECK (
        -- 상태 전환 규칙 검증은 트리거에서 처리
        status_code IN (SELECT code FROM consultation_domain.statuses WHERE is_active = true)
    )

);

-- 상담 연락처 정보 (개인정보 분리)
CREATE TABLE consultation_domain.contacts (
consultation_id UUID PRIMARY KEY REFERENCES consultation_domain.consultations(id) ON DELETE CASCADE,

    -- 암호화된 개인정보
    contact_name_encrypted BYTEA NOT NULL,
    contact_phone_encrypted BYTEA NOT NULL,
    contact_email_encrypted BYTEA NOT NULL,

    -- 검색용 해시 (인덱싱 가능)
    contact_email_hash VARCHAR(64) NOT NULL UNIQUE, -- 중복 신청 방지
    contact_phone_hash VARCHAR(64) NOT NULL,

    -- 일반 정보
    contact_company VARCHAR(200),
    preferred_contact_time contact_time_preference,

    -- 개인정보 처리 동의
    privacy_consent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    marketing_consent BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

);

-- 상담 메타데이터 (추적 정보 분리)
CREATE TABLE consultation_domain.metadata (
consultation_id UUID PRIMARY KEY REFERENCES consultation_domain.consultations(id) ON DELETE CASCADE,

    -- 추적 정보
    user_agent TEXT,
    ip_address INET,
    referrer_url TEXT,

    -- UTM 파라미터 (구조화)
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),

    -- 추가 메타데이터 (유연성)
    additional_data JSONB DEFAULT '{}',

    -- 지역 정보 (GeoIP 기반)
    geo_country VARCHAR(2), -- ISO 국가 코드
    geo_region VARCHAR(100),
    geo_city VARCHAR(100),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

);

-- 가이드 상담 세부사항 (개선된 구조)
CREATE TABLE consultation_domain.guided_details (
consultation_id UUID PRIMARY KEY REFERENCES consultation_domain.consultations(id) ON DELETE CASCADE,

    -- 서비스 정보 (참조 테이블로 확장 가능)
    service_type VARCHAR(50) NOT NULL,
    project_size VARCHAR(20) NOT NULL,
    budget_range VARCHAR(20) NOT NULL,
    timeline VARCHAR(20) NOT NULL,

    -- 기능 요구사항 (정규화)
    important_features JSONB DEFAULT '[]' NOT NULL,
    additional_requests TEXT,

    -- AI 기반 예상 정보
    estimated_budget_min DECIMAL(12,2),
    estimated_budget_max DECIMAL(12,2),
    estimated_duration_months INTEGER,
    complexity_score INTEGER CHECK (complexity_score BETWEEN 1 AND 10),

    -- 분석 결과
    analyzed_keywords TEXT[],
    recommended_approach TEXT,
    risk_factors TEXT[],

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- 제약 조건
    CONSTRAINT valid_budget_range CHECK (estimated_budget_min <= estimated_budget_max),
    CONSTRAINT valid_timeline CHECK (estimated_duration_months > 0)

);

-- 자유 상담 세부사항 (개선된 NLP 분석)
CREATE TABLE consultation_domain.free_details (
consultation_id UUID PRIMARY KEY REFERENCES consultation_domain.consultations(id) ON DELETE CASCADE,

    -- 원본 설명
    project_description TEXT NOT NULL,
    budget_range VARCHAR(200),
    timeline_preference VARCHAR(200),

    -- AI/NLP 분석 결과
    analyzed_keywords TEXT[],
    extracted_requirements JSONB DEFAULT '[]',
    complexity_score INTEGER CHECK (complexity_score BETWEEN 1 AND 10),
    recommended_service_type VARCHAR(50),
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0 AND 1),

    -- 자동 분류
    auto_category VARCHAR(100),
    auto_priority consultation_priority,
    estimated_budget_range VARCHAR(20),
    estimated_timeline VARCHAR(20),

    -- 분석 메타데이터
    analysis_version VARCHAR(10) DEFAULT '1.0',
    analyzed_at TIMESTAMP WITH TIME ZONE,
    analysis_duration_ms INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL

);

-- ==========================================
-- 4. 사용자 도메인 테이블
-- ==========================================

-- 관리자 사용자 (보안 강화)
CREATE TABLE user_domain.admin_users (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 기본 인증 정보
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(255) NOT NULL, -- 추가 보안

    -- 개인정보
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    avatar_url VARCHAR(500),

    -- 권한 정보 (RBAC)
    role VARCHAR(50) DEFAULT 'viewer' NOT NULL,
    permissions JSONB DEFAULT '[]' NOT NULL,
    resource_permissions JSONB DEFAULT '{}', -- 리소스별 권한

    -- 계정 상태
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE NOT NULL,

    -- 보안 정보
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    password_expires_at TIMESTAMP WITH TIME ZONE,

    -- MFA 정보
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(32),
    backup_codes JSONB DEFAULT '[]',

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID, -- 순환 참조 해결을 위해 NULL 허용

    -- 감사 정보
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,

    CONSTRAINT valid_admin_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]+$'),
    CONSTRAINT password_changed_recent CHECK (password_changed_at <= NOW()),
    CONSTRAINT valid_lock_state CHECK (
        (is_locked = FALSE AND locked_until IS NULL) OR
        (is_locked = TRUE AND locked_until > NOW())
    )

);

-- 사용자 역할 정의 (확장 가능)
CREATE TABLE user_domain.roles (
code VARCHAR(50) PRIMARY KEY,
display_name JSONB NOT NULL,
description TEXT,
permissions JSONB DEFAULT '[]' NOT NULL,
is_system_role BOOLEAN DEFAULT FALSE, -- 시스템 기본 역할 여부
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 기본 역할 생성
INSERT INTO user_domain.roles (code, display_name, permissions, is_system_role) VALUES
('admin', '{"ko": "시스템 관리자", "en": "System Administrator"}',
'["*"]', true),
('manager', '{"ko": "관리자", "en": "Manager"}',
'["consultations:*", "stats:read", "users:read"]', true),
('viewer', '{"ko": "조회자", "en": "Viewer"}',
'["consultations:read", "stats:read"]', true);

-- 사용자 세션 (향상된 보안)
CREATE TABLE user_domain.sessions (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID NOT NULL REFERENCES user_domain.admin_users(id) ON DELETE CASCADE,

    -- 토큰 정보 (보안 강화)
    access_token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    token_family UUID DEFAULT gen_random_uuid(), -- 토큰 패밀리 (보안)

    -- 세션 정보
    user_agent TEXT,
    ip_address INET NOT NULL,
    device_fingerprint VARCHAR(255),
    device_info JSONB DEFAULT '{}',

    -- 지역 정보
    geo_location JSONB DEFAULT '{}',

    -- 유효성 정보
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_reason TEXT,

    -- 활동 추적
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    access_count INTEGER DEFAULT 1 NOT NULL,

    CONSTRAINT valid_expiry CHECK (expires_at > created_at),
    CONSTRAINT valid_revoke_state CHECK (
        (is_revoked = FALSE AND revoked_at IS NULL) OR
        (is_revoked = TRUE AND revoked_at IS NOT NULL)
    )

);

-- ==========================================
-- 5. 이벤트 소싱 테이블 (Event Sourcing)
-- ==========================================

CREATE TABLE system_domain.domain_events (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 이벤트 식별
    event_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,

    -- 애그리게이트 정보
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_version INTEGER NOT NULL DEFAULT 1,

    -- 이벤트 데이터
    event_data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',

    -- 추적 정보
    correlation_id UUID,
    causation_id UUID,

    -- 액터 정보
    actor_id UUID,
    actor_type VARCHAR(50) DEFAULT 'system' NOT NULL,

    -- 타임스탬프
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- 이벤트 순서 (성능 최적화)
    sequence_number BIGSERIAL,

    -- 스냅샷 최적화
    is_snapshot BOOLEAN DEFAULT FALSE,
    snapshot_version INTEGER,

    -- 이벤트 상태
    is_processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_attempts INTEGER DEFAULT 0,

    CONSTRAINT positive_aggregate_version CHECK (aggregate_version > 0)

);

-- 이벤트 스트림 고유성 보장
CREATE UNIQUE INDEX idx_domain_events_stream
ON system_domain.domain_events(aggregate_id, aggregate_version);

-- ==========================================
-- 6. 감사 및 로깅 테이블 (개선된 설계)
-- ==========================================

-- 감사 로그 (이벤트 소싱과 분리)
CREATE TABLE system_domain.audit_logs (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 대상 정보
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,

    -- 작업 정보
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],

    -- 액터 정보
    actor_id UUID,
    actor_type VARCHAR(50) DEFAULT 'system' NOT NULL,
    actor_ip INET,
    actor_user_agent TEXT,

    -- 컨텍스트 정보
    request_id UUID,
    session_id UUID,
    correlation_id UUID,

    -- 타임스탬프
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- 중요도
    severity VARCHAR(20) DEFAULT 'info' NOT NULL,
    category VARCHAR(100) DEFAULT 'data_change' NOT NULL,

    CONSTRAINT valid_operation CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    CONSTRAINT valid_severity CHECK (severity IN ('debug', 'info', 'warn', 'error', 'critical'))

);

-- API 호출 로그 (성능 모니터링 중심)
CREATE TABLE system_domain.api_logs (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 요청 정보
    request_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    method VARCHAR(10) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    api_version VARCHAR(10),

    -- 클라이언트 정보
    ip_address INET NOT NULL,
    user_agent TEXT,
    user_id UUID,
    session_id UUID,

    -- 응답 정보
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    response_size_bytes INTEGER,

    -- 에러 정보
    error_code VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,

    -- 메타데이터
    correlation_id UUID,
    parent_request_id UUID, -- 분산 추적
    metadata JSONB DEFAULT '{}',

    -- 성능 메트릭
    db_query_count INTEGER DEFAULT 0,
    db_query_time_ms INTEGER DEFAULT 0,
    cache_hit_count INTEGER DEFAULT 0,
    cache_miss_count INTEGER DEFAULT 0,

    -- 타임스탬프
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- 분류
    category VARCHAR(100) DEFAULT 'api_call',
    severity VARCHAR(20) DEFAULT 'info' NOT NULL,

    CONSTRAINT valid_status_code CHECK (status_code BETWEEN 100 AND 599),
    CONSTRAINT valid_response_time CHECK (response_time_ms >= 0),
    CONSTRAINT positive_metrics CHECK (
        db_query_count >= 0 AND
        db_query_time_ms >= 0 AND
        cache_hit_count >= 0 AND
        cache_miss_count >= 0
    )

);

-- ==========================================
-- 7. 통계 및 분석 테이블 (개선된 설계)
-- ==========================================

-- 일별 통계 (파티셔닝 준비)
CREATE TABLE analytics_domain.daily_stats (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 파티션 키
    date_key DATE NOT NULL,

    -- 상담 통계
    total_consultations INTEGER DEFAULT 0 NOT NULL,
    guided_consultations INTEGER DEFAULT 0 NOT NULL,
    free_consultations INTEGER DEFAULT 0 NOT NULL,

    -- 상태별 통계
    pending_count INTEGER DEFAULT 0 NOT NULL,
    contacted_count INTEGER DEFAULT 0 NOT NULL,
    in_progress_count INTEGER DEFAULT 0 NOT NULL,
    completed_count INTEGER DEFAULT 0 NOT NULL,
    cancelled_count INTEGER DEFAULT 0 NOT NULL,

    -- 성과 지표
    conversion_rate DECIMAL(8,6) DEFAULT 0 NOT NULL,
    avg_response_time_hours DECIMAL(10,2) DEFAULT 0 NOT NULL,
    avg_completion_time_hours DECIMAL(10,2) DEFAULT 0 NOT NULL,

    -- 품질 지표
    customer_satisfaction_avg DECIMAL(3,2), -- 1.00 ~ 5.00
    response_quality_score DECIMAL(3,2),   -- 0.00 ~ 1.00

    -- 트래픽 분석
    unique_visitors INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,4) DEFAULT 0,

    -- UTM 분석
    utm_stats JSONB DEFAULT '{}',
    traffic_sources JSONB DEFAULT '{}',

    -- 계산 메타데이터
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    calculation_duration_ms INTEGER,
    data_version INTEGER DEFAULT 1,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT unique_date_key UNIQUE (date_key),
    CONSTRAINT valid_conversion_rate CHECK (conversion_rate BETWEEN 0 AND 1),
    CONSTRAINT valid_response_time CHECK (avg_response_time_hours >= 0),
    CONSTRAINT valid_satisfaction CHECK (customer_satisfaction_avg IS NULL OR
        customer_satisfaction_avg BETWEEN 1.00 AND 5.00)

) PARTITION BY RANGE (date_key);

-- 월별 파티션 생성 (예시)
CREATE TABLE analytics_domain.daily_stats_y2024m12
PARTITION OF analytics_domain.daily_stats
FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- ==========================================
-- 8. 고급 인덱스 전략
-- ==========================================

-- 상담 테이블 최적화 인덱스
CREATE INDEX CONCURRENTLY idx_consultations_status_created
ON consultation_domain.consultations(status_code, created_at DESC)
WHERE is_deleted = FALSE;

CREATE INDEX CONCURRENTLY idx_consultations_type_status
ON consultation_domain.consultations(type_code, status_code)
WHERE is_deleted = FALSE;

CREATE INDEX CONCURRENTLY idx_consultations_assigned_status
ON consultation_domain.consultations(assigned_to, status_code)
WHERE is_deleted = FALSE AND assigned_to IS NOT NULL;

-- 연락처 검색 인덱스 (해시 기반)
CREATE UNIQUE INDEX idx_contacts_email_hash
ON consultation_domain.contacts(contact_email_hash);

CREATE INDEX idx_contacts_phone_hash
ON consultation_domain.contacts(contact_phone_hash);

-- 이벤트 소싱 최적화 인덱스
CREATE INDEX CONCURRENTLY idx_domain_events_aggregate_sequence
ON system_domain.domain_events(aggregate_id, sequence_number DESC);

CREATE INDEX CONCURRENTLY idx_domain_events_type_occurred
ON system_domain.domain_events(event_type, occurred_at DESC);

CREATE INDEX CONCURRENTLY idx_domain_events_correlation
ON system_domain.domain_events(correlation_id)
WHERE correlation_id IS NOT NULL;

-- API 로그 성능 인덱스
CREATE INDEX CONCURRENTLY idx_api_logs_endpoint_status
ON system_domain.api_logs(endpoint, status_code, started_at DESC);

CREATE INDEX CONCURRENTLY idx_api_logs_performance
ON system_domain.api_logs(started_at DESC, response_time_ms)
WHERE status_code >= 200 AND status_code < 300;

-- 세션 관리 인덱스
CREATE INDEX CONCURRENTLY idx_sessions_user_active
ON user_domain.sessions(user_id, last_accessed_at DESC)
WHERE is_active = TRUE AND is_revoked = FALSE;

CREATE INDEX CONCURRENTLY idx_sessions_cleanup
ON user_domain.sessions(expires_at)
WHERE is_active = TRUE;

-- 통계 분석 인덱스
CREATE INDEX CONCURRENTLY idx_daily_stats_date_desc
ON analytics_domain.daily_stats(date_key DESC);

-- GIN 인덱스 (JSONB 최적화)
CREATE INDEX CONCURRENTLY idx_consultations_metadata_gin
ON consultation_domain.metadata USING GIN(additional_data);

CREATE INDEX CONCURRENTLY idx_guided_details_features_gin
ON consultation_domain.guided_details USING GIN(important_features);

CREATE INDEX CONCURRENTLY idx_events_data_gin
ON system_domain.domain_events USING GIN(event_data);

-- ==========================================
-- 9. 고급 제약 조건 및 검증
-- ==========================================

-- 상태 전환 검증 함수
CREATE OR REPLACE FUNCTION consultation_domain.validate_status_transition(
old_status_code TEXT,
new_status_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
allowed_transitions TEXT[];
BEGIN
IF old_status_code = new_status_code THEN
RETURN TRUE; -- 동일 상태는 허용
END IF;

    SELECT allows_transition_to INTO allowed_transitions
    FROM consultation_domain.statuses
    WHERE code = old_status_code;

    RETURN new_status_code = ANY(allowed_transitions);

END;
$$ LANGUAGE plpgsql STABLE;
