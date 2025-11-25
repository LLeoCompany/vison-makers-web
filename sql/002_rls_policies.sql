-- LeoFitTech RLS (Row Level Security) 정책 설정
-- Supabase Dashboard > SQL Editor에서 실행

-- ==========================================
-- RLS 활성화
-- ==========================================

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guided_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_stats ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- consultations 테이블 RLS 정책
-- ==========================================

-- 관리자가 모든 상담 조회 가능
CREATE POLICY "Admin users can view all consultations" ON consultations
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 관리자가 상담 생성 가능
CREATE POLICY "Admin users can insert consultations" ON consultations
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 관리자가 상담 수정 가능
CREATE POLICY "Admin users can update consultations" ON consultations
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 시스템 레벨에서 상담 삭제 가능 (Admin 역할만)
CREATE POLICY "System admins can delete consultations" ON consultations
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role = 'admin'
        )
    );

-- 공개 API에서 상담 생성 허용 (인증되지 않은 사용자)
CREATE POLICY "Allow public consultation submission" ON consultations
    FOR INSERT TO anon
    WITH CHECK (true);

-- ==========================================
-- guided_consultations 테이블 RLS 정책
-- ==========================================

CREATE POLICY "Admin users can access guided consultations" ON guided_consultations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 공개 API에서 가이드 상담 생성 허용
CREATE POLICY "Allow public guided consultation creation" ON guided_consultations
    FOR INSERT TO anon
    WITH CHECK (true);

-- ==========================================
-- free_consultations 테이블 RLS 정책
-- ==========================================

CREATE POLICY "Admin users can access free consultations" ON free_consultations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 공개 API에서 자유 상담 생성 허용
CREATE POLICY "Allow public free consultation creation" ON free_consultations
    FOR INSERT TO anon
    WITH CHECK (true);

-- ==========================================
-- admin_users 테이블 RLS 정책
-- ==========================================

-- 활성 관리자가 다른 관리자 조회 가능
CREATE POLICY "Admin users can view other admins" ON admin_users
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users au
            WHERE au.id = auth.uid() AND au.is_active = true
        )
    );

-- 관리자가 자신의 프로필 수정 가능
CREATE POLICY "Admins can update their own profile" ON admin_users
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admin 역할만 다른 사용자 생성 가능
CREATE POLICY "Only admins can create users" ON admin_users
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role = 'admin'
        )
    );

-- Admin 역할만 다른 사용자 삭제 가능
CREATE POLICY "Only admins can delete users" ON admin_users
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role = 'admin'
        )
        AND id != auth.uid() -- 자기 자신은 삭제 불가
    );

-- ==========================================
-- user_sessions 테이블 RLS 정책
-- ==========================================

-- 사용자가 자신의 세션만 조회/관리 가능
CREATE POLICY "Users can access their own sessions" ON user_sessions
    FOR ALL TO authenticated
    USING (user_id = auth.uid());

-- 시스템이 세션 생성 허용 (로그인 프로세스)
CREATE POLICY "Allow system session creation" ON user_sessions
    FOR INSERT TO anon
    WITH CHECK (true);

-- ==========================================
-- consultation_logs 테이블 RLS 정책
-- ==========================================

-- 관리자가 상담 로그 조회 가능
CREATE POLICY "Admin users can view consultation logs" ON consultation_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 시스템이 로그 생성 허용
CREATE POLICY "Allow system log creation" ON consultation_logs
    FOR INSERT TO anon
    WITH CHECK (true);

-- 관리자가 로그 생성 가능 (수동 로그)
CREATE POLICY "Admin users can create logs" ON consultation_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- ==========================================
-- api_logs 테이블 RLS 정책
-- ==========================================

-- Admin 역할만 API 로그 조회 가능
CREATE POLICY "Only admins can view API logs" ON api_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role IN ('admin', 'manager')
        )
    );

-- 시스템이 API 로그 생성 허용
CREATE POLICY "Allow system API log creation" ON api_logs
    FOR INSERT TO anon
    WITH CHECK (true);

-- ==========================================
-- system_configs 테이블 RLS 정책
-- ==========================================

-- 공개 설정은 모든 인증된 사용자가 조회 가능
-- 비공개 설정은 Admin/Manager만 조회 가능
CREATE POLICY "Admin users can view configs" ON system_configs
    FOR SELECT TO authenticated
    USING (
        is_public = true OR
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role IN ('admin', 'manager')
        )
    );

-- Admin 역할만 설정 수정/생성 가능
CREATE POLICY "Only admins can modify configs" ON system_configs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role = 'admin'
        )
    );

-- ==========================================
-- consultation_stats 테이블 RLS 정책
-- ==========================================

-- 관리자가 통계 조회 가능
CREATE POLICY "Admin users can view stats" ON consultation_stats
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true
        )
    );

-- 시스템이 통계 생성/수정 허용
CREATE POLICY "Allow system stats management" ON consultation_stats
    FOR ALL TO anon
    WITH CHECK (true);

-- Admin/Manager가 통계 수정 가능 (수동 조정)
CREATE POLICY "Admin users can modify stats" ON consultation_stats
    FOR INSERT, UPDATE TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role IN ('admin', 'manager')
        )
    )
    USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid() AND is_active = true AND role IN ('admin', 'manager')
        )
    );

-- ==========================================
-- Service Role 권한 설정
-- (Supabase Service Role이 모든 작업 가능하도록)
-- ==========================================

-- Service Role은 RLS를 우회할 수 있으므로 별도 정책 불필요
-- API에서 supabaseAdmin 클라이언트 사용시 자동으로 Service Role 사용됨

-- ==========================================
-- 추가 보안 함수
-- ==========================================

-- 현재 사용자가 관리자인지 확인하는 함수
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = user_uuid AND is_active = true AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 현재 사용자가 특정 권한을 가지고 있는지 확인하는 함수
CREATE OR REPLACE FUNCTION has_permission(permission_name TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users
        WHERE id = user_uuid
        AND is_active = true
        AND (
            role = 'admin' OR
            permission_name = ANY(permissions)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 현재 사용자가 특정 상담에 접근할 수 있는지 확인하는 함수
CREATE OR REPLACE FUNCTION can_access_consultation(consultation_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    -- 관리자는 모든 상담 접근 가능
    IF is_admin(user_uuid) THEN
        RETURN TRUE;
    END IF;

    -- 배정된 담당자는 해당 상담 접근 가능
    RETURN EXISTS (
        SELECT 1 FROM consultations
        WHERE id = consultation_uuid AND assigned_to = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;