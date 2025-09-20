// Example: Admin Dashboard Component
// VisionMakers - Direct Supabase Usage Example

'use client';

import React, { useState, useEffect } from 'react';
import {
  getConsultations,
  getConsultationStats,
  updateConsultationStatus,
} from '@/services/consultation';
import {
  loginAdmin,
  logoutAdmin,
  getUserById,
} from '@/services/auth';
import type {
  ConsultationDetailsView,
  ConsultationStatus,
  AdminUserRow,
} from '@/types/database';

interface AdminDashboardProps {
  initialUser?: AdminUserRow;
}

export default function AdminDashboard({ initialUser }: AdminDashboardProps) {
  const [user, setUser] = useState<AdminUserRow | null>(initialUser || null);
  const [consultations, setConsultations] = useState<ConsultationDetailsView[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    status: '' as ConsultationStatus | '',
    type: '' as 'guided' | 'free' | '',
    search: '',
    page: 1,
    limit: 10,
  });

  // Load data when user is authenticated
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load consultations and stats in parallel
      const [consultationsResult, statsResult] = await Promise.all([
        getConsultations({
          page: filters.page,
          limit: filters.limit,
          status: filters.status || undefined,
          type: filters.type || undefined,
          search: filters.search || undefined,
        }),
        getConsultationStats(),
      ]);

      if (consultationsResult.success && consultationsResult.data) {
        setConsultations(consultationsResult.data.consultations);
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      const result = await loginAdmin(loginForm, {
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1', // In real app, get from API
      });

      if (result.success && result.data) {
        setUser(result.data.user);
        // In real app, store tokens in secure storage
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
      } else {
        setError(result.error?.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (user) {
      await logoutAdmin(user.id);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const handleStatusUpdate = async (consultationId: string, newStatus: ConsultationStatus) => {
    try {
      const result = await updateConsultationStatus(consultationId, newStatus);

      if (result.success) {
        // Reload consultations
        loadDashboardData();
      } else {
        setError(result.error?.message || '상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      setError('상태 업데이트 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  const getStatusBadge = (status: ConsultationStatus) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      on_hold: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      pending: '대기중',
      contacted: '연락완료',
      in_progress: '진행중',
      completed: '완료',
      cancelled: '취소',
      on_hold: '보류',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Login Form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              관리자 로그인
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              VisionMakers 관리자 대시보드
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="admin@visionmakers.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">테스트 계정:</p>
              <p>이메일: admin@visionmakers.com</p>
              <p>비밀번호: VisionMakers2024!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600">안녕하세요, {user.full_name}님!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">전체 상담</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">대기중</dt>
                      <dd className="text-lg font-medium text-yellow-600">{stats.pending}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">완료</dt>
                      <dd className="text-lg font-medium text-green-600">{stats.completed}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">오늘</dt>
                      <dd className="text-lg font-medium text-blue-600">{stats.today}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체</option>
                  <option value="pending">대기중</option>
                  <option value="contacted">연락완료</option>
                  <option value="in_progress">진행중</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">타입</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value as any, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체</option>
                  <option value="guided">가이드 상담</option>
                  <option value="free">자유 상담</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  placeholder="이름, 이메일, 회사명으로 검색"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">표시 개수</label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10개</option>
                  <option value={20}>20개</option>
                  <option value={50}>50개</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">상담 목록</h3>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상담번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      고객정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      타입
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {consultation.consultation_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{consultation.contact_name}</div>
                        <div className="text-sm text-gray-500">{consultation.contact_email}</div>
                        {consultation.contact_company && (
                          <div className="text-sm text-gray-500">{consultation.contact_company}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {consultation.type === 'guided' ? '가이드' : '자유'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(consultation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(consultation.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={consultation.status}
                          onChange={(e) => handleStatusUpdate(consultation.id, e.target.value as ConsultationStatus)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">대기중</option>
                          <option value="contacted">연락완료</option>
                          <option value="in_progress">진행중</option>
                          <option value="completed">완료</option>
                          <option value="cancelled">취소</option>
                          <option value="on_hold">보류</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {consultations.length === 0 && !loading && (
            <div className="p-6 text-center text-gray-500">
              상담 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}