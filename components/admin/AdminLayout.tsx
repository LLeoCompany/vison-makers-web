/**
 * 관리자 페이지 공통 레이아웃
 * IMWEB 스타일 기반 레이아웃
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { isAdminAuthenticated, logout, getAdminInfo } from '@/utils/adminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = '관리자' }: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications] = useState(3); // 임시 알림 수
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    consultations: true,
    analytics: false
  });
  const router = useRouter();

  // 인증 체크
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
    }
  }, [router]);

  // 현재 경로 체크
  const isActivePath = (path: string) => {
    return router.asPath.startsWith(path);
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      logout();
    }
  };

  const adminInfo = getAdminInfo();

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="admin-layout">
      {/* 헤더 */}
      <header className="admin-header">
        <div className="header-brand">
          <button
            className="mobile-menu-button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            ☰
          </button>
          <div className="logo-placeholder">VM</div>
          <div className="app-info">
            <span className="app-name">상담 관리</span>
            <span className="environment-badge">개발</span>
          </div>
        </div>

        <div className="quick-actions">
          <div className="quick-menu">
            <button className="quick-trigger">
              빠른 실행 ▼
            </button>
            <div className="quick-dropdown">
              <Link href="/admin/consultations/new">🆕 새 상담 등록</Link>
              <Link href="/admin/consultations?status=urgent">🚨 긴급 상담</Link>
              <Link href="/admin/analytics/today">📊 오늘 통계</Link>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="notification-bell">
            <button className="notification-trigger">
              🔔
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </button>
          </div>

          <div className="account-menu">
            <button className="account-trigger">
              <div className="avatar">관</div>
              <span className="user-name">{adminInfo.name}</span>
            </button>
            <div className="account-dropdown">
              <div className="user-info">
                <strong>{adminInfo.name}</strong>
                <span>{adminInfo.role}</span>
              </div>
              <hr />
              <button onClick={handleLogout} className="logout-btn">
                🚪 로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-content">
        {/* 사이드바 */}
        <nav className={`admin-sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="title-icon">📋</span>
              <span className="title-text">관리 메뉴</span>
            </div>
            <button
              className="collapse-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
            >
              <span className={`collapse-icon ${isSidebarCollapsed ? 'collapsed' : ''}`}>‹</span>
            </button>
          </div>

          <div className="sidebar-content">
            <ul className="nav-menu">
              <li className={`nav-item ${isActivePath('/admin/dashboard') ? 'active' : ''}`}>
                <Link href="/admin/dashboard" className="nav-link" title="대시보드">
                  <div className="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7v10a2 2 0 002 2h16a2 2 0 002-2V7L12 2z"/>
                    </svg>
                  </div>
                  <span className="nav-text">대시보드</span>
                </Link>
              </li>

              <li className="nav-item has-submenu">
                <div
                  className="nav-link"
                  onClick={() => toggleSubmenu('consultations')}
                  onKeyDown={(e) => handleKeyPress(e, () => toggleSubmenu('consultations'))}
                  role="button"
                  tabIndex={0}
                  title="상담 관리"
                  aria-expanded={openSubmenus.consultations}
                  aria-controls="consultations-submenu"
                >
                  <div className="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 2H4a2 2 0 00-2 2v16a2 2 0 002 2h5V2zM15 2h5a2 2 0 012 2v16a2 2 0 01-2 2h-5V2z"/>
                    </svg>
                  </div>
                  <span className="nav-text">상담 관리</span>
                  <div className={`nav-arrow ${openSubmenus.consultations ? 'open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
                <ul
                  id="consultations-submenu"
                  className={`nav-submenu ${openSubmenus.consultations ? 'open' : ''}`}
                  role="menu"
                >
                  <li>
                    <Link href="/admin/consultations" className={isActivePath('/admin/consultations') ? 'active' : ''}>
                      <span className="submenu-icon">📊</span>
                      <span className="submenu-text">전체 목록</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/consultations?status=pending">
                      <span className="submenu-icon">🆕</span>
                      <span className="submenu-text">신규 접수</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/consultations?status=reviewing">
                      <span className="submenu-icon">⏳</span>
                      <span className="submenu-text">처리 중</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/consultations?status=completed">
                      <span className="submenu-icon">✅</span>
                      <span className="submenu-text">완료됨</span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item has-submenu">
                <div
                  className="nav-link"
                  onClick={() => toggleSubmenu('analytics')}
                  onKeyDown={(e) => handleKeyPress(e, () => toggleSubmenu('analytics'))}
                  role="button"
                  tabIndex={0}
                  title="통계 분석"
                  aria-expanded={openSubmenus.analytics}
                  aria-controls="analytics-submenu"
                >
                  <div className="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 17V21H20V17H22ZM14 9V21H16V9H14ZM6 13V21H8V13H6ZM2 17V21H4V17H2Z"/>
                    </svg>
                  </div>
                  <span className="nav-text">통계 분석</span>
                  <div className={`nav-arrow ${openSubmenus.analytics ? 'open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z"/>
                    </svg>
                  </div>
                </div>
                <ul
                  id="analytics-submenu"
                  className={`nav-submenu ${openSubmenus.analytics ? 'open' : ''}`}
                  role="menu"
                >
                  <li>
                    <Link href="/admin/analytics/dashboard">
                      <span className="submenu-icon">📊</span>
                      <span className="submenu-text">대시보드</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/analytics/performance">
                      <span className="submenu-icon">🎯</span>
                      <span className="submenu-text">성과 분석</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/analytics/conversion">
                      <span className="submenu-icon">💱</span>
                      <span className="submenu-text">전환율</span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link href="/admin/settings" className="nav-link" title="설정">
                  <div className="nav-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 15.5A3.5 3.5 0 018.5 12A3.5 3.5 0 0112 8.5A3.5 3.5 0 0115.5 12A3.5 3.5 0 0112 15.5M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12S19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12S4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.03 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z"/>
                    </svg>
                  </div>
                  <span className="nav-text">설정</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-footer">
            <div className="status-indicator">
              <div className="status-dot online"></div>
              <span className="status-text">시스템 정상</span>
            </div>
            <div className="version-badge">v1.0.0</div>
          </div>
        </nav>

        {/* 모바일 오버레이 */}
        {isMobileSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* 메인 콘텐츠 */}
        <main className="admin-main">
          {children}
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f9fafb;
        }

        /* 헤더 스타일 */
        .admin-header {
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
        }

        .logo-placeholder {
          height: 32px;
          width: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: white;
        }

        .app-info {
          display: flex;
          flex-direction: column;
        }

        .app-name {
          font-size: 18px;
          font-weight: 600;
        }

        .environment-badge {
          font-size: 10px;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 8px;
          width: fit-content;
        }

        .quick-actions {
          position: relative;
        }

        .quick-menu {
          position: relative;
        }

        .quick-trigger {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .quick-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
          min-width: 200px;
          display: none;
          z-index: 1000;
        }

        .quick-menu:hover .quick-dropdown {
          display: block;
        }

        .quick-dropdown a {
          display: block;
          padding: 8px 16px;
          color: #374151;
          text-decoration: none;
          font-size: 14px;
        }

        .quick-dropdown a:hover {
          background: #f3f4f6;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notification-bell {
          position: relative;
        }

        .notification-trigger {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          font-size: 10px;
          padding: 2px 6px;
          min-width: 16px;
          text-align: center;
          line-height: 1;
        }

        .account-menu {
          position: relative;
        }

        .account-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
        }

        .account-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 16px;
          min-width: 200px;
          display: none;
          z-index: 1000;
        }

        .account-menu:hover .account-dropdown {
          display: block;
        }

        .user-info {
          margin-bottom: 12px;
        }

        .user-info strong {
          display: block;
          color: #1f2937;
          font-size: 14px;
        }

        .user-info span {
          color: #6b7280;
          font-size: 12px;
        }

        .logout-btn {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          padding: 8px 0;
          color: #ef4444;
          cursor: pointer;
          font-size: 14px;
        }

        /* 콘텐츠 영역 */
        .admin-content {
          display: flex;
          flex: 1;
        }

        /* 사이드바 스타일 */
        .admin-sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          position: sticky;
          top: 60px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }

        .admin-sidebar.collapsed {
          width: 72px;
        }

        /* 사이드바 헤더 */
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #fafbfc;
          min-height: 64px;
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          color: #1f2937;
          font-size: 16px;
        }

        .title-icon {
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-text {
          font-weight: 600;
        }

        .collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: #f8fafc;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #64748b;
        }

        .collapse-btn:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .collapse-icon {
          font-size: 18px;
          font-weight: 600;
          transition: transform 0.3s ease;
        }

        .collapse-icon.collapsed {
          transform: rotate(180deg);
        }

        /* 사이드바 콘텐츠 */
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .nav-menu {
          list-style: none;
          margin: 0;
          padding: 0 12px;
        }

        .nav-item {
          margin-bottom: 4px;
        }

        .nav-item.active > .nav-link {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
        }

        .nav-item.active > .nav-link .nav-icon svg {
          color: white;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #4b5563;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-weight: 500;
          min-height: 48px;
        }

        .nav-link:hover {
          background: #f8fafc;
          color: #1f2937;
        }

        .nav-link:hover .nav-icon svg {
          color: #3b82f6;
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: #6b7280;
          transition: color 0.2s ease;
        }

        .nav-icon svg {
          width: 20px;
          height: 20px;
        }

        .nav-text {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }

        .nav-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: #9ca3af;
          transition: transform 0.3s ease;
        }

        .nav-arrow.open {
          transform: rotate(180deg);
        }

        .nav-arrow svg {
          width: 16px;
          height: 16px;
        }

        /* 서브메뉴 */
        .nav-submenu {
          list-style: none;
          margin: 4px 0 0 0;
          padding: 0;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
          background: #f8fafc;
          border-radius: 6px;
        }

        .nav-submenu.open {
          max-height: 300px;
          padding: 8px 0;
        }

        .nav-submenu li {
          margin: 0;
        }

        .nav-submenu a {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px 8px 48px;
          color: #6b7280;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          border-radius: 6px;
          margin: 0 8px;
          transition: all 0.2s ease;
        }

        .nav-submenu a:hover {
          background: #e2e8f0;
          color: #374151;
        }

        .nav-submenu a.active {
          background: #dbeafe;
          color: #2563eb;
        }

        .submenu-icon {
          font-size: 14px;
        }

        .submenu-text {
          font-size: 13px;
        }

        /* 사이드바 푸터 */
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #f1f5f9;
          background: #fafbfc;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .status-dot.online {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }

        .status-text {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .version-badge {
          display: inline-block;
          padding: 2px 8px;
          background: #e5e7eb;
          color: #6b7280;
          font-size: 11px;
          font-weight: 600;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* 메인 콘텐츠 */
        .admin-main {
          flex: 1;
          padding: 24px;
          overflow-x: auto;
        }

        .sidebar-overlay {
          display: none;
        }

        /* 모바일 반응형 */
        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block;
          }

          .app-info {
            display: none;
          }

          .quick-actions {
            display: none;
          }

          .admin-sidebar {
            position: fixed;
            left: -260px;
            top: 60px;
            height: calc(100vh - 60px);
            z-index: 1000;
            transition: left 0.3s ease;
          }

          .admin-sidebar.mobile-open {
            left: 0;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }

          .admin-main {
            padding: 16px;
          }

          .admin-header {
            padding: 0 16px;
          }
        }

        /* Collapsed 상태 스타일 */
        .admin-sidebar.collapsed .title-text,
        .admin-sidebar.collapsed .nav-text,
        .admin-sidebar.collapsed .nav-arrow,
        .admin-sidebar.collapsed .nav-submenu,
        .admin-sidebar.collapsed .status-text,
        .admin-sidebar.collapsed .version-badge {
          display: none;
        }

        .admin-sidebar.collapsed .sidebar-header {
          justify-content: center;
          padding: 20px 8px;
        }

        .admin-sidebar.collapsed .sidebar-title {
          justify-content: center;
        }

        .admin-sidebar.collapsed .collapse-btn {
          position: absolute;
          top: 16px;
          right: 8px;
          width: 24px;
          height: 24px;
        }

        .admin-sidebar.collapsed .nav-menu {
          padding: 0 8px;
        }

        .admin-sidebar.collapsed .nav-link {
          justify-content: center;
          padding: 12px 8px;
          position: relative;
        }

        .admin-sidebar.collapsed .nav-link:hover::after {
          content: attr(title);
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #1f2937;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }

        .admin-sidebar.collapsed .nav-link:hover::before {
          content: '';
          position: absolute;
          left: calc(100% + 6px);
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-right-color: #1f2937;
          z-index: 1000;
          pointer-events: none;
        }

        .admin-sidebar.collapsed .has-submenu .nav-link {
          cursor: default;
        }

        .admin-sidebar.collapsed .sidebar-footer {
          padding: 16px 8px;
        }

        .admin-sidebar.collapsed .status-indicator {
          justify-content: center;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}