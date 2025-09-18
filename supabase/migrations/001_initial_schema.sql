-- VisionMakers 상담시스템 데이터베이스 스키마
-- 작성일: 2024-09-17
-- 버전: 1.0

-- =========================================================================
-- 1. CONSULTATIONS 테이블 (상담신청 메인)
-- =========================================================================

CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_number VARCHAR(20) UNIQUE NOT NULL, -- CS-YYYYMMDD-XXXX 형식
  type VARCHAR(10) NOT NULL CHECK (type IN ('guided', 'free')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'contacted', 'completed', 'cancelled')),
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- 연락처 정보
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_company VARCHAR(200),
  preferred_contact_time VARCHAR(20),

  -- 메타데이터
  user_agent TEXT,
  ip_address INET,
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- 시간 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  contacted_at TIMESTAMP WITH TIME ZONE,

  -- 제약조건
  CONSTRAINT consultations_email_check CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT consultations_phone_check CHECK (contact_phone ~* '^[0-9\-\+\s]+$')
);

-- 인덱스 생성
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX idx_consultations_type ON consultations(type);
CREATE INDEX idx_consultations_email ON consultations(contact_email);
CREATE INDEX idx_consultations_number ON consultations(consultation_number);

-- =========================================================================
-- 2. GUIDED_CONSULTATIONS 테이블 (가이드 트랙 전용)
-- =========================================================================

CREATE TABLE guided_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  -- Step 1: 서비스 종류
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('homepage', 'shopping', 'booking', 'membership', 'other')),

  -- Step 2: 규모와 예산
  project_size VARCHAR(10) NOT NULL CHECK (project_size IN ('small', 'medium', 'large')),
  budget VARCHAR(20) NOT NULL CHECK (budget IN ('100-300', '300-800', '800-1500', '1500+', 'consult')),

  -- Step 3: 일정과 특별 요청
  timeline VARCHAR(20) NOT NULL CHECK (timeline IN ('1month', '2-3months', '6months', 'flexible')),
  important_features JSONB DEFAULT '[]', -- ['mobile', 'seo', 'admin', 'payment']
  additional_requests TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guided_consultations_consultation_id ON guided_consultations(consultation_id);
CREATE INDEX idx_guided_consultations_service_type ON guided_consultations(service_type);
CREATE INDEX idx_guided_consultations_budget ON guided_consultations(budget);
CREATE INDEX idx_guided_consultations_project_size ON guided_consultations(project_size);

-- =========================================================================
-- 3. FREE_CONSULTATIONS 테이블 (자유 트랙 전용)
-- =========================================================================

CREATE TABLE free_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  -- 프로젝트 설명
  project_description TEXT NOT NULL CHECK (LENGTH(project_description) >= 20),

  -- 선택적 정보
  budget_range VARCHAR(200),
  timeline_preference VARCHAR(200),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_free_consultations_consultation_id ON free_consultations(consultation_id);

-- =========================================================================
-- 4. CONSULTATION_LOGS 테이블 (활동 로그)
-- =========================================================================

CREATE TABLE consultation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  action VARCHAR(50) NOT NULL, -- 'created', 'status_changed', 'contacted', 'note_added'
  details JSONB, -- 추가 정보 (이전 상태, 새 상태 등)
  notes TEXT,

  -- 작업자 정보 (추후 관리자 시스템 연동)
  actor_type VARCHAR(20) DEFAULT 'system', -- 'system', 'admin', 'api'
  actor_id VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consultation_logs_consultation_id ON consultation_logs(consultation_id);
CREATE INDEX idx_consultation_logs_created_at ON consultation_logs(created_at DESC);
CREATE INDEX idx_consultation_logs_action ON consultation_logs(action);

-- =========================================================================
-- 5. CONSULTATION_STATS 테이블 (통계 정보)
-- =========================================================================

CREATE TABLE consultation_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 일일 통계
  total_submissions INTEGER DEFAULT 0,
  guided_submissions INTEGER DEFAULT 0,
  free_submissions INTEGER DEFAULT 0,

  -- 전환율 관련
  page_views INTEGER DEFAULT 0,
  form_starts INTEGER DEFAULT 0,
  form_completions INTEGER DEFAULT 0,

  -- 소스별 통계
  source_stats JSONB DEFAULT '{}', -- {"organic": 10, "google_ads": 5, ...}

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(date)
);

CREATE INDEX idx_consultation_stats_date ON consultation_stats(date DESC);

-- =========================================================================
-- 6. 트리거 함수들
-- =========================================================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 updated_at 트리거 적용
CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guided_consultations_updated_at
    BEFORE UPDATE ON guided_consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_free_consultations_updated_at
    BEFORE UPDATE ON free_consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_stats_updated_at
    BEFORE UPDATE ON consultation_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================================
-- 7. 상담번호 생성 함수
-- =========================================================================

CREATE OR REPLACE FUNCTION generate_consultation_number()
RETURNS TEXT AS $$
DECLARE
    date_part TEXT;
    sequence_part TEXT;
    next_sequence INTEGER;
BEGIN
    -- 날짜 부분 (YYYYMMDD)
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');

    -- 해당 날짜의 다음 시퀀스 번호 계산
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(consultation_number FROM 12 FOR 4) AS INTEGER)
    ), 0) + 1
    INTO next_sequence
    FROM consultations
    WHERE consultation_number LIKE 'CS-' || date_part || '-%';

    -- 4자리 시퀀스로 포맷팅
    sequence_part := LPAD(next_sequence::TEXT, 4, '0');

    RETURN 'CS-' || date_part || '-' || sequence_part;
END;
$$ LANGUAGE plpgsql;

-- =========================================================================
-- 8. 통계 업데이트 함수
-- =========================================================================

CREATE OR REPLACE FUNCTION update_consultation_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 새로운 상담 신청 시 통계 업데이트
    IF TG_OP = 'INSERT' THEN
        INSERT INTO consultation_stats (date, total_submissions, guided_submissions, free_submissions)
        VALUES (CURRENT_DATE, 1,
                CASE WHEN NEW.type = 'guided' THEN 1 ELSE 0 END,
                CASE WHEN NEW.type = 'free' THEN 1 ELSE 0 END)
        ON CONFLICT (date) DO UPDATE SET
            total_submissions = consultation_stats.total_submissions + 1,
            guided_submissions = consultation_stats.guided_submissions +
                CASE WHEN NEW.type = 'guided' THEN 1 ELSE 0 END,
            free_submissions = consultation_stats.free_submissions +
                CASE WHEN NEW.type = 'free' THEN 1 ELSE 0 END,
            updated_at = NOW();
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 통계 업데이트 트리거
CREATE TRIGGER trigger_update_consultation_stats
    AFTER INSERT ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_consultation_stats();

-- =========================================================================
-- 9. 로그 자동 생성 함수
-- =========================================================================

CREATE OR REPLACE FUNCTION log_consultation_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- 상태 변경 로그
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO consultation_logs (consultation_id, action, details, actor_type)
        VALUES (NEW.id, 'status_changed',
                jsonb_build_object(
                    'old_status', OLD.status,
                    'new_status', NEW.status,
                    'changed_at', NOW()
                ), 'system');
    END IF;

    -- 연락 완료 시간 업데이트
    IF TG_OP = 'UPDATE' AND NEW.status = 'contacted' AND OLD.status != 'contacted' THEN
        NEW.contacted_at = NOW();
    END IF;

    -- 검토 시작 시간 업데이트
    IF TG_OP = 'UPDATE' AND NEW.status = 'reviewing' AND OLD.status = 'pending' THEN
        NEW.reviewed_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 로그 생성 트리거
CREATE TRIGGER trigger_log_consultation_changes
    BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION log_consultation_changes();

-- =========================================================================
-- 10. RLS (Row Level Security) 정책
-- =========================================================================

-- RLS 활성화
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_stats ENABLE ROW LEVEL SECURITY;

-- consultations 테이블 정책
CREATE POLICY "Enable read access for all users" ON consultations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON consultations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON consultations
    FOR UPDATE USING (auth.role() = 'service_role');

-- guided_consultations 테이블 정책
CREATE POLICY "Enable read access for all users" ON guided_consultations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON guided_consultations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON guided_consultations
    FOR UPDATE USING (auth.role() = 'service_role');

-- free_consultations 테이블 정책
CREATE POLICY "Enable read access for all users" ON free_consultations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON free_consultations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON free_consultations
    FOR UPDATE USING (auth.role() = 'service_role');

-- consultation_logs 테이블 정책
CREATE POLICY "Enable read access for service role" ON consultation_logs
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert for all users" ON consultation_logs
    FOR INSERT WITH CHECK (true);

-- consultation_stats 테이블 정책
CREATE POLICY "Enable read access for service role" ON consultation_stats
    FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert/update for service role" ON consultation_stats
    FOR ALL USING (auth.role() = 'service_role');

-- =========================================================================
-- 11. 초기 데이터 (옵션)
-- =========================================================================

-- 오늘 날짜의 초기 통계 레코드 생성
INSERT INTO consultation_stats (date, total_submissions, guided_submissions, free_submissions)
VALUES (CURRENT_DATE, 0, 0, 0)
ON CONFLICT (date) DO NOTHING;

-- =========================================================================
-- 12. 유용한 뷰 생성
-- =========================================================================

-- 상담 상세 정보 뷰
CREATE VIEW consultation_details AS
SELECT
    c.*,
    gc.service_type,
    gc.project_size,
    gc.budget,
    gc.timeline,
    gc.important_features,
    gc.additional_requests,
    fc.project_description,
    fc.budget_range,
    fc.timeline_preference
FROM consultations c
LEFT JOIN guided_consultations gc ON c.id = gc.consultation_id
LEFT JOIN free_consultations fc ON c.id = fc.consultation_id;

-- 일일 통계 요약 뷰
CREATE VIEW daily_stats_summary AS
SELECT
    date,
    total_submissions,
    guided_submissions,
    free_submissions,
    ROUND((guided_submissions::FLOAT / NULLIF(total_submissions, 0)) * 100, 2) as guided_percentage,
    ROUND((free_submissions::FLOAT / NULLIF(total_submissions, 0)) * 100, 2) as free_percentage
FROM consultation_stats
ORDER BY date DESC;

-- 상담 상태별 카운트 뷰
CREATE VIEW consultation_status_counts AS
SELECT
    status,
    COUNT(*) as count,
    ROUND((COUNT(*)::FLOAT / (SELECT COUNT(*) FROM consultations)) * 100, 2) as percentage
FROM consultations
GROUP BY status
ORDER BY count DESC;