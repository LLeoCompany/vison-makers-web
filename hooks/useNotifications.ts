/**
 * 알림 관리 훅
 * 실시간 알림 시스템과 연동된 React 훅
 */

import { useState, useEffect, useCallback } from 'react';
import NotificationService from '../utils/notificationService';
import type { Notification } from '../pages/api/admin/notifications';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearError: () => void;
}

export interface UseNotificationsOptions {
  enableRealTime?: boolean;
  pollInterval?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const {
    enableRealTime = true,
    pollInterval = 30000,
    limit = 20,
    unreadOnly = false
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 알림 목록 조회
  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString()
      });

      const response = await fetch(`/api/admin/notifications?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, unreadOnly]);

  // 알림 새로고침
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    await fetchNotifications();
  }, [fetchNotifications]);

  // 개별 알림 읽음 처리
  const markAsRead = useCallback(async (id: string) => {
    try {
      setError(null);
      await NotificationService.getInstance().markAsRead(id);

      // 로컬 상태 업데이트
      setNotifications(prev => prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true, readAt: new Date().toISOString() }
          : notification
      ));

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read';
      setError(errorMessage);
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(async () => {
    try {
      setError(null);
      await NotificationService.getInstance().markAllAsRead();

      // 로컬 상태 업데이트
      const now = new Date().toISOString();
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt || now
      })));

      setUnreadCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read';
      setError(errorMessage);
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  // 에러 상태 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 실시간 알림 처리
  useEffect(() => {
    if (!enableRealTime) return;

    const notificationService = NotificationService.getInstance({
      enableBrowserNotifications: true,
      enableSoundAlerts: true,
      pollInterval
    });

    // 새로운 알림 수신 처리
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => {
        // 중복 알림 방지
        const exists = prev.some(n => n.id === notification.id);
        if (exists) return prev;

        // 새 알림을 맨 앞에 추가
        return [notification, ...prev].slice(0, limit);
      });

      // 읽지 않은 알림인 경우 카운트 증가
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }
    };

    // 알림 서비스 구독
    const subscriptionId = 'useNotifications-' + Date.now();
    notificationService.subscribe(subscriptionId, handleNewNotification);

    // 알림 서비스 시작
    notificationService.start().catch(err => {
      console.error('Failed to start notification service:', err);
    });

    // 클린업
    return () => {
      notificationService.unsubscribe(subscriptionId);
    };
  }, [enableRealTime, pollInterval, limit]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 페이지 가시성 변경 시 알림 갱신
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    clearError
  };
};