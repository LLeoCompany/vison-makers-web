-- VisionMakers Database Schema Migration
-- 실행 순서: Supabase Dashboard > SQL Editor에서 실행

-- ==========================================
-- 1. ENUM 타입 생성
-- ==========================================

-- 상담 타입
CREATE TYPE consultation_type AS ENUM ('guided', 'free');

-- 상담 상태
CREATE TYPE consultation_status AS ENUM (
    'pending',     -- 대기중
    'contacted',   -- 연락완료
    'in_progress', -- 진행중
    'completed',   -- 완료
    'cancelled',   -- 취소
    'on_hold'      -- 보류
);

-- 상담 우선순위
CREATE TYPE consultation_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- 연락 선호 시간
CREATE TYPE contact_time_preference AS ENUM (
    'morning',     -- 오전 (9-12시)
    'afternoon',   -- 오후 (12-18시)
    'evening',     -- 저녁 (18-21시)
    'anytime'      -- 언제나
);

-- 서비스 타입
CREATE TYPE service_type_enum AS ENUM (
    'web_development',      -- 웹 개발
    'mobile_app',          -- 모바일 앱
    'desktop_app',         -- 데스크탑 앱
    'ai_ml',              -- AI/ML
    'blockchain',         -- 블록체인
    'iot',               -- IoT
    'consulting',        -- 컨설팅
    'maintenance',       -- 유지보수
    'other'              -- 기타
);

-- 프로젝트 규모
CREATE TYPE project_size_enum AS ENUM ('small', 'medium', 'large', 'enterprise');

-- 예산 범위
CREATE TYPE budget_range_enum AS ENUM (
    'under_1000',        -- 100만원 미만
    '1000_to_3000',      -- 100-300만원
    '3000_to_5000',      -- 300-500만원
    '5000_to_10000',     -- 500-1000만원
    'over_10000',        -- 1000만원 초과
    'negotiable'         -- 협의
);

-- 타임라인
CREATE TYPE timeline_enum AS ENUM (
    'asap',              -- 최대한 빨리
    '1_month',           -- 1개월 이내
    '1_3_months',        -- 1-3개월
    '3_6_months',        -- 3-6개월
    '6_12_months',       -- 6-12개월
    'over_1_year',       -- 1년 이상
    'flexible'           -- 유연함
);

-- 관리자 역할
CREATE TYPE admin_role AS ENUM ('admin', 'manager', 'viewer');

-- 상담 액션
CREATE TYPE consultation_action AS ENUM (
    'created',           -- 생성됨
    'updated',           -- 수정됨
    'status_changed',    -- 상태 변경
    'assigned',          -- 담당자 배정
    'contacted',         -- 연락 시도
    'completed',         -- 완료
    'cancelled',         -- 취소
    'note_added'         -- 노트 추가
);

-- 액터 타입
CREATE TYPE actor_type_enum AS ENUM ('system', 'admin', 'api');

-- 설정 타입
CREATE TYPE config_type_enum AS ENUM ('string', 'number', 'boolean', 'json', 'array');

-- ==========================================
-- 2. 기본 테이블 생성
-- ==========================================

-- 관리자 사용자 테이블 (외래키 참조를 위해 먼저 생성)
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    -- 개인정보
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),

    -- 권한 정보
    role admin_role DEFAULT 'viewer' NOT NULL,
    permissions TEXT[] DEFAULT '{}',

    -- 계정 상태
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,

    -- 보안 정보
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0 NOT NULL,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES admin_users(id),

    CONSTRAINT valid_admin_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_]+$'),
    CONSTRAINT password_changed_recent CHECK (password_changed_at <= NOW())
);

-- 메인 상담 테이블
CREATE TABLE consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consultation_number VARCHAR(50) NOT NULL UNIQUE,
    type consultation_type NOT NULL,
    status consultation_status DEFAULT 'pending' NOT NULL,
    priority consultation_priority DEFAULT 'normal' NOT NULL,

    -- 연락처 정보
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_company VARCHAR(200),
    preferred_contact_time contact_time_preference,

    -- 메타데이터
    user_agent TEXT,
    ip_address INET,
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- 담당자 정보
    assigned_to UUID REFERENCES admin_users(id),

    -- 추가 메타데이터
    metadata JSONB DEFAULT '{}',

    CONSTRAINT valid_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (contact_phone ~* '^[0-9\-\+\(\)\s]+$')
);

-- 가이드 상담 세부사항
CREATE TABLE guided_consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

    -- 서비스 정보
    service_type service_type_enum NOT NULL,
    project_size project_size_enum NOT NULL,
    budget budget_range_enum NOT NULL,
    timeline timeline_enum NOT NULL,

    -- 기능 요구사항
    important_features TEXT[] NOT NULL DEFAULT '{}',
    additional_requests TEXT,

    -- 예상 정보
    estimated_budget_min INTEGER,
    estimated_budget_max INTEGER,
    estimated_duration_months INTEGER,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT unique_consultation_guided UNIQUE (consultation_id)
);

-- 자유 상담 세부사항
CREATE TABLE free_consultations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

    -- 프로젝트 정보
    project_description TEXT NOT NULL,
    budget_range VARCHAR(200),
    timeline_preference VARCHAR(200),

    -- 분석 결과
    analyzed_keywords TEXT[],
    complexity_score INTEGER CHECK (complexity_score BETWEEN 1 AND 10),
    recommended_service_type service_type_enum,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT unique_consultation_free UNIQUE (consultation_id)
);

-- 사용자 세션 관리
CREATE TABLE user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,

    -- 토큰 정보
    access_token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,

    -- 세션 정보
    user_agent TEXT,
    ip_address INET NOT NULL,
    device_info JSONB DEFAULT '{}',

    -- 유효성 정보
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- 상담 활동 로그
CREATE TABLE consultation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

    -- 액션 정보
    action consultation_action NOT NULL,
    details JSONB DEFAULT '{}',

    -- 액터 정보
    actor_type actor_type_enum DEFAULT 'system' NOT NULL,
    actor_id UUID REFERENCES admin_users(id),
    actor_name VARCHAR(100),

    -- 변경 정보
    old_values JSONB,
    new_values JSONB,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    ip_address INET,
    user_agent TEXT
);

-- API 호출 로그
CREATE TABLE api_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 요청 정보
    method VARCHAR(10) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    api_version VARCHAR(10),

    -- 클라이언트 정보
    ip_address INET NOT NULL,
    user_agent TEXT,
    user_id UUID REFERENCES admin_users(id),

    -- 응답 정보
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER,
    response_size_bytes INTEGER,

    -- 에러 정보
    error_code VARCHAR(100),
    error_message TEXT,

    -- 메타데이터
    request_id UUID,
    correlation_id UUID,
    metadata JSONB DEFAULT '{}',

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT valid_status_code CHECK (status_code BETWEEN 100 AND 599),
    CONSTRAINT valid_response_time CHECK (response_time_ms >= 0)
);

-- 시스템 설정
CREATE TABLE system_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 설정 정보
    config_key VARCHAR(200) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    config_type config_type_enum DEFAULT 'string' NOT NULL,

    -- 메타데이터
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE NOT NULL,

    -- 유효성 정보
    validation_rules JSONB DEFAULT '{}',
    default_value JSONB,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES admin_users(id)
);

-- 일별 통계
CREATE TABLE consultation_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- 날짜 정보
    date DATE NOT NULL,

    -- 통계 정보
    total_submissions INTEGER DEFAULT 0 NOT NULL,
    guided_submissions INTEGER DEFAULT 0 NOT NULL,
    free_submissions INTEGER DEFAULT 0 NOT NULL,
    completed_consultations INTEGER DEFAULT 0 NOT NULL,
    pending_consultations INTEGER DEFAULT 0 NOT NULL,
    cancelled_consultations INTEGER DEFAULT 0 NOT NULL,

    -- 성과 지표
    conversion_rate DECIMAL(5,4) DEFAULT 0 NOT NULL,
    avg_response_time_hours DECIMAL(8,2) DEFAULT 0 NOT NULL,

    -- 시스템 필드
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    CONSTRAINT unique_date UNIQUE (date),
    CONSTRAINT valid_conversion_rate CHECK (conversion_rate BETWEEN 0 AND 1),
    CONSTRAINT valid_response_time CHECK (avg_response_time_hours >= 0)
);

-- ==========================================
-- 3. 인덱스 생성
-- ==========================================

-- consultations 테이블 인덱스
CREATE INDEX idx_consultations_type ON consultations(type);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX idx_consultations_updated_at ON consultations(updated_at DESC);
CREATE INDEX idx_consultations_email ON consultations(contact_email);
CREATE INDEX idx_consultations_phone ON consultations(contact_phone);
CREATE INDEX idx_consultations_assigned_to ON consultations(assigned_to);
CREATE INDEX idx_consultations_utm ON consultations(utm_source, utm_medium, utm_campaign);
CREATE INDEX idx_consultations_number ON consultations(consultation_number);

-- guided_consultations 테이블 인덱스
CREATE INDEX idx_guided_consultations_consultation_id ON guided_consultations(consultation_id);
CREATE INDEX idx_guided_consultations_service_type ON guided_consultations(service_type);
CREATE INDEX idx_guided_consultations_budget ON guided_consultations(budget);

-- free_consultations 테이블 인덱스
CREATE INDEX idx_free_consultations_consultation_id ON free_consultations(consultation_id);

-- admin_users 테이블 인덱스
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_users_last_login ON admin_users(last_login_at DESC);

-- user_sessions 테이블 인덱스
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_access_token ON user_sessions(access_token_hash);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token_hash);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);

-- consultation_logs 테이블 인덱스
CREATE INDEX idx_consultation_logs_consultation_id ON consultation_logs(consultation_id);
CREATE INDEX idx_consultation_logs_action ON consultation_logs(action);
CREATE INDEX idx_consultation_logs_actor_id ON consultation_logs(actor_id);
CREATE INDEX idx_consultation_logs_created_at ON consultation_logs(created_at DESC);

-- api_logs 테이블 인덱스
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX idx_api_logs_status_code ON api_logs(status_code);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_ip_address ON api_logs(ip_address);

-- system_configs 테이블 인덱스
CREATE INDEX idx_system_configs_key ON system_configs(config_key);
CREATE INDEX idx_system_configs_category ON system_configs(category);

-- consultation_stats 테이블 인덱스
CREATE INDEX idx_consultation_stats_date ON consultation_stats(date DESC);

-- GIN 인덱스 (JSONB 필드용)
CREATE INDEX idx_consultations_metadata_gin ON consultations USING GIN(metadata);
CREATE INDEX idx_guided_consultations_features_gin ON guided_consultations USING GIN(important_features);
CREATE INDEX idx_api_logs_metadata_gin ON api_logs USING GIN(metadata);

-- ==========================================
-- 4. 뷰 생성
-- ==========================================

-- 상담 상세 정보 뷰
CREATE VIEW consultation_details AS
SELECT
    c.id,
    c.consultation_number,
    c.type,
    c.status,
    c.priority,
    c.contact_name,
    c.contact_email,
    c.contact_phone,
    c.contact_company,
    c.preferred_contact_time,
    c.created_at,
    c.updated_at,
    c.assigned_to,
    au.full_name AS assigned_to_name,

    -- 가이드 상담 정보
    gc.service_type,
    gc.project_size,
    gc.budget,
    gc.timeline,
    gc.important_features,
    gc.additional_requests,

    -- 자유 상담 정보
    fc.project_description,
    fc.budget_range,
    fc.timeline_preference,

    -- 메타데이터
    c.utm_source,
    c.utm_medium,
    c.utm_campaign,
    c.metadata

FROM consultations c
LEFT JOIN admin_users au ON c.assigned_to = au.id
LEFT JOIN guided_consultations gc ON c.id = gc.consultation_id
LEFT JOIN free_consultations fc ON c.id = fc.consultation_id;

-- 상태별 카운트 뷰
CREATE VIEW consultation_status_counts AS
SELECT
    status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM consultations
GROUP BY status
ORDER BY count DESC;

-- ==========================================
-- 5. 함수 및 트리거 생성
-- ==========================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guided_consultations_updated_at
    BEFORE UPDATE ON guided_consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_free_consultations_updated_at
    BEFORE UPDATE ON free_consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_configs_updated_at
    BEFORE UPDATE ON system_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 상담 로그 자동 생성 함수
CREATE OR REPLACE FUNCTION log_consultation_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO consultation_logs (
            consultation_id,
            action,
            actor_type,
            new_values
        ) VALUES (
            NEW.id,
            'created',
            'system',
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- 상태 변경 로그
        IF OLD.status != NEW.status THEN
            INSERT INTO consultation_logs (
                consultation_id,
                action,
                actor_type,
                old_values,
                new_values
            ) VALUES (
                NEW.id,
                'status_changed',
                'system',
                jsonb_build_object('status', OLD.status),
                jsonb_build_object('status', NEW.status)
            );
        END IF;

        -- 담당자 배정 로그
        IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
            INSERT INTO consultation_logs (
                consultation_id,
                action,
                actor_type,
                old_values,
                new_values
            ) VALUES (
                NEW.id,
                'assigned',
                'system',
                jsonb_build_object('assigned_to', OLD.assigned_to),
                jsonb_build_object('assigned_to', NEW.assigned_to)
            );
        END IF;

        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER trigger_log_consultation_changes
    AFTER INSERT OR UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION log_consultation_changes();

-- 일별 통계 업데이트 함수
CREATE OR REPLACE FUNCTION update_daily_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_date DATE;
BEGIN
    -- 대상 날짜 결정
    IF TG_OP = 'INSERT' THEN
        target_date = NEW.created_at::DATE;
    ELSE
        target_date = OLD.created_at::DATE;
    END IF;

    -- 통계 업데이트
    INSERT INTO consultation_stats (
        date,
        total_submissions,
        guided_submissions,
        free_submissions,
        completed_consultations,
        pending_consultations,
        cancelled_consultations
    )
    SELECT
        target_date,
        COUNT(*),
        COUNT(*) FILTER (WHERE type = 'guided'),
        COUNT(*) FILTER (WHERE type = 'free'),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COUNT(*) FILTER (WHERE status = 'cancelled')
    FROM consultations
    WHERE created_at::DATE = target_date
    ON CONFLICT (date) DO UPDATE SET
        total_submissions = EXCLUDED.total_submissions,
        guided_submissions = EXCLUDED.guided_submissions,
        free_submissions = EXCLUDED.free_submissions,
        completed_consultations = EXCLUDED.completed_consultations,
        pending_consultations = EXCLUDED.pending_consultations,
        cancelled_consultations = EXCLUDED.cancelled_consultations,
        updated_at = NOW();

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 트리거 적용
CREATE TRIGGER trigger_update_daily_stats
    AFTER INSERT OR UPDATE OR DELETE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_daily_stats();