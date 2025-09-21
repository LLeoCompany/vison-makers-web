/**
 * 관리자 인증 유틸리티
 * 세션 기반 간단 인증 시스템
 */

// 관리자 인증 체크
export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const authStatus = sessionStorage.getItem('adminAuth');
  const loginTime = sessionStorage.getItem('adminLoginTime');

  if (authStatus !== 'true' || !loginTime) {
    return false;
  }

  // 24시간 세션 만료 체크
  const loginDate = new Date(loginTime);
  const now = new Date();
  const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

  if (hoursDiff > 24) {
    logout();
    return false;
  }

  return true;
};

// 로그아웃
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = '/admin/login';
  }
};

// 관리자 페이지 접근 권한 체크
export const requireAuth = () => {
  if (!isAdminAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return false;
  }
  return true;
};

// 세션 연장
export const extendSession = (): void => {
  if (isAdminAuthenticated()) {
    sessionStorage.setItem('adminLoginTime', new Date().toISOString());
  }
};

// 관리자 정보 (간단한 목 데이터)
export const getAdminInfo = () => {
  return {
    name: '관리자',
    role: 'admin',
    email: 'admin@visionmakers.co.kr',
    loginTime: typeof window !== 'undefined' ? sessionStorage.getItem('adminLoginTime') : null,
    permissions: ['consultation:read', 'consultation:write', 'analytics:read']
  };
};