/**
 * 실시간 알림 서비스
 * WebSocket 기반 실시간 알림 및 브라우저 알림 관리
 */

import type { Notification } from '../pages/api/admin/notifications';

export type NotificationEventType =
  | 'new_consultation'
  | 'status_update'
  | 'assignment'
  | 'deadline'
  | 'system'
  | 'urgent';

export interface NotificationEvent {
  type: NotificationEventType;
  data: Notification;
}

export interface NotificationServiceConfig {
  enableBrowserNotifications: boolean;
  enableSoundAlerts: boolean;
  websocketUrl?: string;
  pollInterval?: number;
}

class NotificationService {
  private static instance: NotificationService;
  private websocket: WebSocket | null = null;
  private pollTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, (notification: Notification) => void> = new Map();
  private config: NotificationServiceConfig;
  private lastNotificationCheck: Date = new Date();

  private constructor(config: NotificationServiceConfig) {
    this.config = {
      enableBrowserNotifications: true,
      enableSoundAlerts: true,
      pollInterval: 30000, // 30초
      ...config
    };
  }

  public static getInstance(config?: NotificationServiceConfig): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService(config || {
        enableBrowserNotifications: true,
        enableSoundAlerts: true
      });
    }
    return NotificationService.instance;
  }

  // 서비스 시작
  public async start(): Promise<void> {
    try {
      // 브라우저 알림 권한 요청
      if (this.config.enableBrowserNotifications) {
        await this.requestNotificationPermission();
      }

      // WebSocket 연결 시도 (실제 환경에서는 서버 구현 필요)
      if (this.config.websocketUrl) {
        this.connectWebSocket();
      } else {
        // WebSocket이 없는 경우 폴링 방식 사용
        this.startPolling();
      }

      console.log('Notification service started');
    } catch (error) {
      console.error('Failed to start notification service:', error);
      // 폴백으로 폴링 시작
      this.startPolling();
    }
  }

  // 서비스 중지
  public stop(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    this.listeners.clear();
    console.log('Notification service stopped');
  }

  // 알림 리스너 등록
  public subscribe(id: string, callback: (notification: Notification) => void): void {
    this.listeners.set(id, callback);
  }

  // 알림 리스너 해제
  public unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  // 브라우저 알림 권한 요청
  private async requestNotificationPermission(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
      }
    }
  }

  // WebSocket 연결
  private connectWebSocket(): void {
    if (!this.config.websocketUrl) return;

    try {
      this.websocket = new WebSocket(this.config.websocketUrl);

      this.websocket.onopen = () => {
        console.log('WebSocket connected');
      };

      this.websocket.onmessage = (event) => {
        try {
          const notificationEvent: NotificationEvent = JSON.parse(event.data);
          this.handleNotification(notificationEvent.data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(() => this.connectWebSocket(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  // 폴링 방식으로 알림 확인
  private startPolling(): void {
    if (this.pollTimer) return;

    this.pollTimer = setInterval(async () => {
      try {
        await this.checkForNewNotifications();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, this.config.pollInterval);
  }

  // 새로운 알림 확인 (API 호출)
  private async checkForNewNotifications(): Promise<void> {
    try {
      const response = await fetch('/api/admin/notifications?unreadOnly=true&limit=10');
      if (!response.ok) return;

      const data = await response.json();
      const notifications: Notification[] = data.notifications;

      // 마지막 확인 시간 이후의 새로운 알림만 처리
      const newNotifications = notifications.filter(notification =>
        new Date(notification.createdAt) > this.lastNotificationCheck
      );

      if (newNotifications.length > 0) {
        newNotifications.forEach(notification => {
          this.handleNotification(notification);
        });
        this.lastNotificationCheck = new Date();
      }
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  }

  // 알림 처리
  private handleNotification(notification: Notification): void {
    // 리스너들에게 알림 전달
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });

    // 브라우저 알림 표시
    if (this.config.enableBrowserNotifications) {
      this.showBrowserNotification(notification);
    }

    // 사운드 알림 재생
    if (this.config.enableSoundAlerts) {
      this.playNotificationSound(notification);
    }

    // 긴급 알림의 경우 추가 처리
    if (notification.priority === 'urgent') {
      this.handleUrgentNotification(notification);
    }
  }

  // 브라우저 알림 표시
  private showBrowserNotification(notification: Notification): void {
    if (
      !('Notification' in window) ||
      Notification.permission !== 'granted' ||
      document.visibilityState === 'visible' // 페이지가 활성화된 경우 브라우저 알림 생략
    ) {
      return;
    }

    const options: NotificationOptions = {
      body: notification.message,
      icon: '/logo.svg',
      badge: '/logo.svg',
      tag: notification.id, // 중복 알림 방지
      requireInteraction: notification.priority === 'urgent',
      actions: notification.actionUrl ? [
        { action: 'view', title: '보기' },
        { action: 'dismiss', title: '닫기' }
      ] : undefined
    };

    const browserNotification = new Notification(notification.title, options);

    browserNotification.onclick = () => {
      if (notification.actionUrl) {
        window.open(notification.actionUrl, '_blank');
      }
      browserNotification.close();
    };

    // 자동 닫기 (긴급 알림 제외)
    if (notification.priority !== 'urgent') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  // 알림 사운드 재생
  private playNotificationSound(notification: Notification): void {
    if (!this.config.enableSoundAlerts) return;

    try {
      // 우선순위에 따른 다른 사운드
      const soundFile = this.getSoundFile(notification.priority);
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    } catch (error) {
      console.warn('Notification sound error:', error);
    }
  }

  // 우선순위별 사운드 파일 반환
  private getSoundFile(priority: Notification['priority']): string {
    const soundMap = {
      urgent: '/sounds/urgent-notification.mp3',
      high: '/sounds/high-notification.mp3',
      medium: '/sounds/medium-notification.mp3',
      low: '/sounds/low-notification.mp3'
    };

    return soundMap[priority] || soundMap.medium;
  }

  // 긴급 알림 처리
  private handleUrgentNotification(notification: Notification): void {
    // 긴급 알림의 경우 즉시 읽음 처리 API 호출하지 않음
    // 사용자가 명시적으로 확인할 때까지 유지

    // 브라우저 포커스가 없는 경우 페이지 타이틀 깜빡임
    if (document.visibilityState === 'hidden') {
      this.startTitleBlink('🚨 긴급 알림');
    }

    console.warn('Urgent notification:', notification);
  }

  // 페이지 타이틀 깜빡임 효과
  private startTitleBlink(message: string): void {
    const originalTitle = document.title;
    let isBlinking = true;
    let blinkCount = 0;
    const maxBlinks = 10;

    const blinkInterval = setInterval(() => {
      if (document.visibilityState === 'visible' || blinkCount >= maxBlinks) {
        document.title = originalTitle;
        clearInterval(blinkInterval);
        return;
      }

      document.title = isBlinking ? message : originalTitle;
      isBlinking = !isBlinking;
      blinkCount++;
    }, 1000);

    // 페이지가 다시 활성화되면 깜빡임 중지
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        document.title = originalTitle;
        clearInterval(blinkInterval);
        document.removeEventListener('visibilitychange', visibilityHandler);
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);
  }

  // 설정 업데이트
  public updateConfig(newConfig: Partial<NotificationServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // 알림 읽음 처리
  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await fetch(`/api/admin/notifications?action=read&id=${notificationId}`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  // 모든 알림 읽음 처리
  public async markAllAsRead(): Promise<void> {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'mark_all_read' })
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }
}

export default NotificationService;