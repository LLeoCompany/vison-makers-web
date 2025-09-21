/**
 * 관리자 대시보드 페이지
 * IMWEB 스타일 기반 대시보드
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { isAdminAuthenticated } from '@/utils/adminAuth';
import type { AnalyticsData } from '@/pages/api/admin/analytics';
import type { ConsultationListResponse } from '@/pages/api/admin/consultations';

// 대시보드 데이터 타입
interface DashboardStats {
  todayConsultations: number;
  pendingCount: number;
  completionRate: number;
  expectedRevenue: number;
  todayTrend: number;
  weeklyData: number[];
}

// 상담 아이템 타입
interface ConsultationItem {
  id: string;
  clientName: string;
  projectType: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  timeAgo: string;
  status: 'pending' | 'reviewing' | 'approved' | 'completed';
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentConsultations, setRecentConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 분석 데이터 가져오기
        const analyticsResponse = await fetch('/api/admin/analytics');
        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);

        // 최근 상담 데이터 가져오기 (최신 5개)
        const consultationsResponse = await fetch('/api/admin/consultations?limit=5&sortBy=created_at&sortOrder=desc');
        if (!consultationsResponse.ok) {
          throw new Error('Failed to fetch consultations data');
        }
        const consultationsData: ConsultationListResponse = await consultationsResponse.json();

        // ConsultationItem 타입에 맞게 변환
        const transformedConsultations: ConsultationItem[] = consultationsData.consultations.map(consultation => ({
          id: consultation.consultationNumber,
          clientName: consultation.name,
          projectType: consultation.projectType || consultation.consultationType,
          priority: consultation.priority === 'urgent' ? 'urgent' :
                   consultation.priority === 'high' ? 'high' : 'normal',
          timeAgo: getTimeAgo(consultation.createdAt),
          status: consultation.status === 'pending' ? 'pending' :
                 consultation.status === 'in_progress' ? 'reviewing' :
                 consultation.status === 'completed' ? 'completed' : 'pending'
        }));

        setRecentConsultations(transformedConsultations);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // 30초마다 데이터 새로고침
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 시간 차이 계산 함수
  const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🚨';
      case 'high': return '🔴';
      case 'normal': return '📋';
      case 'low': return '🔵';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'normal': return '#6b7280';
      case 'low': return '#9ca3af';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="대시보드">
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>대시보드 데이터를 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="대시보드">
        <div className="dashboard-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>데이터를 불러올 수 없습니다</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              다시 시도
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout title="대시보드">
        <div className="dashboard-container">
          <div className="error-container">
            <p>데이터가 없습니다.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="대시보드">
      <div className="dashboard-container">
        {/* 페이지 헤더 */}
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">대시보드</h1>
            <nav className="breadcrumb">
              <span>홈</span> / <span className="current">대시보드</span>
            </nav>
          </div>
          <div className="page-actions">
            <button className="btn-secondary">📊 리포트 생성</button>
            <button className="btn-primary">🆕 새 상담</button>
          </div>
        </div>

        {/* KPI 카드 그리드 */}
        <div className="kpi-grid">
          <div className="kpi-card primary">
            <div className="kpi-header">
              <span className="kpi-icon">📞</span>
              <h3 className="kpi-title">오늘 신규 상담</h3>
            </div>
            <div className="kpi-content">
              <div className="kpi-metric">
                <span className="kpi-value">{analytics.trends.consultationsByDay.slice(-1)[0]?.count || 0}</span>
                <span className="kpi-unit">건</span>
              </div>
              <div className="kpi-trend positive">
                <span className="trend-icon">📈</span>
                <span className="trend-value">+12%</span>
                <span className="trend-period">어제 대비</span>
              </div>
            </div>
            <div className="kpi-footer">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${analytics.performance.monthlyTargets.achievementRate}%` }}></div>
              </div>
              <span className="progress-text">월 목표의 {analytics.performance.monthlyTargets.achievementRate}%</span>
            </div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-header">
              <span className="kpi-icon">⏱️</span>
              <h3 className="kpi-title">처리 대기</h3>
            </div>
            <div className="kpi-content">
              <div className="kpi-metric">
                <span className="kpi-value">{analytics.overview.pendingConsultations}</span>
                <span className="kpi-unit">건</span>
              </div>
              <div className="kpi-urgent">
                <span className="urgent-count">
                  {recentConsultations.filter(c => c.priority === 'urgent').length}건 긴급
                </span>
              </div>
            </div>
          </div>

          <div className="kpi-card success">
            <div className="kpi-header">
              <span className="kpi-icon">✅</span>
              <h3 className="kpi-title">완료율</h3>
            </div>
            <div className="kpi-content">
              <div className="kpi-metric">
                <span className="kpi-value">{analytics.overview.conversionRate}</span>
                <span className="kpi-unit">%</span>
              </div>
              <div className="kpi-benchmark">
                <span className="benchmark-text">목표: 90%</span>
              </div>
            </div>
          </div>

          <div className="kpi-card info">
            <div className="kpi-header">
              <span className="kpi-icon">💰</span>
              <h3 className="kpi-title">예상 매출</h3>
            </div>
            <div className="kpi-content">
              <div className="kpi-metric">
                <span className="kpi-value">
                  {Math.round(analytics.overview.totalConsultations * 50).toLocaleString()}
                </span>
                <span className="kpi-unit">만원</span>
              </div>
              <div className="kpi-trend positive">
                <span className="trend-icon">📈</span>
                <span className="trend-value">+8%</span>
                <span className="trend-period">지난 주</span>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 그리드 */}
        <div className="dashboard-grid">
          {/* 좌측 메인 영역 */}
          <div className="dashboard-main-area">
            {/* 실시간 상담 현황 */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">🔴 실시간 상담 현황</h2>
                <button className="section-action">전체 보기</button>
              </div>
              <div className="consultation-list">
                {recentConsultations.map((consultation) => (
                  <div key={consultation.id} className={`consultation-item ${consultation.priority}`}>
                    <div className="consultation-priority">
                      {getPriorityIcon(consultation.priority)}
                    </div>
                    <div className="consultation-info">
                      <h4 className="client-name">{consultation.clientName}</h4>
                      <p className="project-type">{consultation.projectType}</p>
                      <span className="consultation-time">{consultation.timeAgo}</span>
                    </div>
                    <div className="consultation-actions">
                      <button className="btn-sm btn-primary">확인</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 주간 통계 차트 */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">📈 주간 상담 추이</h2>
                <div className="chart-controls">
                  <select className="chart-period">
                    <option>최근 7일</option>
                    <option>최근 30일</option>
                    <option>최근 3개월</option>
                  </select>
                </div>
              </div>
              <div className="chart-container">
                <div className="simple-chart">
                  {analytics.trends.consultationsByDay.slice(-7).map((dayData, index) => {
                    const maxValue = Math.max(...analytics.trends.consultationsByDay.slice(-7).map(d => d.count));
                    const dayName = new Date(dayData.date).toLocaleDateString('ko-KR', { weekday: 'short' });
                    return (
                      <div key={dayData.date} className="chart-bar">
                        <div
                          className="bar-fill"
                          style={{ height: `${maxValue > 0 ? (dayData.count / maxValue) * 100 : 0}%` }}
                        ></div>
                        <span className="bar-label">{dayName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* 우측 사이드 영역 */}
          <div className="dashboard-sidebar">
            {/* 팀 현황 */}
            <section className="sidebar-section">
              <h3 className="sidebar-title">👥 팀 현황</h3>
              <div className="team-status">
                {analytics.performance.teamMembers.map((member) => (
                  <div key={member.id} className="team-member online">
                    <div className="member-avatar">
                      {member.name.charAt(0)}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <span className="member-status">
                        처리 중 {member.assignedCount - member.completedCount}건
                      </span>
                    </div>
                    <div className="member-indicator online"></div>
                  </div>
                ))}
              </div>
            </section>

            {/* 빠른 액션 */}
            <section className="sidebar-section">
              <h3 className="sidebar-title">⚡ 빠른 액션</h3>
              <div className="quick-actions-grid">
                <button className="quick-action-btn">
                  <span className="action-icon">🆕</span>
                  <span className="action-text">새 상담</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">📊</span>
                  <span className="action-text">리포트</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">⚙️</span>
                  <span className="action-text">설정</span>
                </button>
                <button className="quick-action-btn">
                  <span className="action-icon">📤</span>
                  <span className="action-text">내보내기</span>
                </button>
              </div>
            </section>

            {/* 최근 알림 */}
            <section className="sidebar-section">
              <h3 className="sidebar-title">🔔 최근 알림</h3>
              <div className="notification-list">
                {analytics.recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={activity.id} className={`notification-item ${index === 0 ? 'new' : ''}`}>
                    <div className="notification-icon">
                      {activity.type === 'new_consultation' ? '🆕' :
                       activity.type === 'status_change' ? '✅' :
                       activity.type === 'assignment' ? '👤' :
                       activity.type === 'completion' ? '✅' : '📝'}
                    </div>
                    <div className="notification-content">
                      <p className="notification-text">{activity.description}</p>
                      <span className="notification-time">{getTimeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* 로딩 및 에러 상태 */
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-container h3 {
          color: #1f2937;
          margin-bottom: 8px;
        }

        .error-container p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        /* 페이지 헤더 */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .breadcrumb {
          font-size: 14px;
          color: #6b7280;
        }

        .breadcrumb .current {
          color: #3b82f6;
        }

        .page-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        /* KPI 카드 그리드 */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .kpi-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .kpi-icon {
          font-size: 24px;
        }

        .kpi-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin: 0;
        }

        .kpi-content {
          margin-bottom: 16px;
        }

        .kpi-metric {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 8px;
        }

        .kpi-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .kpi-unit {
          font-size: 16px;
          color: #6b7280;
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .kpi-trend.positive {
          color: #059669;
        }

        .trend-icon {
          font-size: 14px;
        }

        .trend-value {
          font-size: 14px;
          font-weight: 600;
        }

        .trend-period {
          font-size: 12px;
          color: #6b7280;
        }

        .kpi-urgent {
          color: #dc2626;
          font-size: 14px;
          font-weight: 600;
        }

        .kpi-benchmark {
          font-size: 12px;
          color: #6b7280;
        }

        .kpi-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #6b7280;
          white-space: nowrap;
        }

        /* 메인 콘텐츠 그리드 */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
        }

        .dashboard-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          margin-bottom: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .section-action {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          cursor: pointer;
        }

        /* 상담 목록 */
        .consultation-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .consultation-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          border-left: 4px solid transparent;
        }

        .consultation-item.urgent {
          border-left-color: #dc2626;
        }

        .consultation-item.normal {
          border-left-color: #6b7280;
        }

        .consultation-priority {
          font-size: 20px;
        }

        .consultation-info {
          flex: 1;
        }

        .client-name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .project-type {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .consultation-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        /* 차트 */
        .chart-container {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .simple-chart {
          display: flex;
          align-items: end;
          gap: 12px;
          height: 150px;
          width: 100%;
        }

        .chart-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
        }

        .bar-fill {
          width: 100%;
          background: linear-gradient(to top, #3b82f6, #60a5fa);
          border-radius: 4px 4px 0 0;
          min-height: 4px;
          transition: height 0.3s ease;
        }

        .bar-label {
          margin-top: 8px;
          font-size: 12px;
          color: #6b7280;
        }

        .chart-period {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        /* 사이드바 */
        .sidebar-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 16px 0;
        }

        /* 팀 현황 */
        .team-status {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .team-member {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .member-avatar {
          width: 36px;
          height: 36px;
          background: #e5e7eb;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #374151;
        }

        .team-member.online .member-avatar {
          background: #d1fae5;
          color: #065f46;
        }

        .member-info {
          flex: 1;
        }

        .member-name {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
        }

        .member-status {
          font-size: 12px;
          color: #6b7280;
        }

        .member-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .member-indicator.online {
          background: #10b981;
        }

        .member-indicator.offline {
          background: #6b7280;
        }

        /* 빠른 액션 */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-action-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .action-icon {
          font-size: 20px;
        }

        .action-text {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        /* 알림 목록 */
        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .notification-item.new {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .notification-icon {
          font-size: 16px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-text {
          font-size: 14px;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .notification-time {
          font-size: 12px;
          color: #6b7280;
        }

        /* 반응형 */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            order: -1;
          }

          .kpi-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .kpi-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .dashboard-section {
            padding: 16px;
          }

          .sidebar-section {
            padding: 16px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}