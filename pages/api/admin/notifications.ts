/**
 * 알림 관리 API
 * GET /api/admin/notifications - 알림 목록 조회
 * PUT /api/admin/notifications/[id]/read - 알림 읽음 처리
 * POST /api/admin/notifications/mark-all-read - 모든 알림 읽음 처리
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import type { ConsultationPriority } from '@/types/database';

export interface Notification {
  id: string;
  type: 'new_consultation' | 'status_update' | 'assignment' | 'deadline' | 'system' | 'urgent';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  readAt?: string;
  relatedId?: string; // 연관된 상담 ID 등
  actionUrl?: string; // 클릭시 이동할 URL
  metadata?: Record<string, any>;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
}

// 실제 데이터베이스에서 알림 생성
const generateNotifications = async (unreadOnly: boolean = false, limit: number = 20): Promise<Notification[]> => {
  try {
    // 상담 로그에서 알림 생성
    let query = supabaseAdmin
      .from('consultation_logs')
      .select(`
        id,
        action,
        created_at,
        consultation_id,
        consultations!inner(
          contact_name,
          contact_company,
          priority,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Failed to fetch notification logs:', error);
      return [];
    }

    const notifications: Notification[] = (logs || []).map((log: any, index: number) => {
      const consultation = log.consultations;
      const isUrgent = consultation.priority === 'urgent';
      const isNewConsultation = log.action === 'created';

      // 알림 타입 결정
      let type: Notification['type'] = 'system';
      if (log.action === 'created') type = 'new_consultation';
      else if (log.action === 'status_changed') type = 'status_update';
      else if (log.action === 'assigned') type = 'assignment';
      else if (isUrgent) type = 'urgent';

      // 우선순위 결정
      let priority: Notification['priority'] = 'medium';
      if (isUrgent || isNewConsultation) priority = 'urgent';
      else if (consultation.priority === 'high') priority = 'high';
      else if (consultation.priority === 'low') priority = 'low';

      // 제목과 메시지 생성
      const { title, message } = generateNotificationContent(
        log.action,
        consultation.contact_name,
        consultation.contact_company
      );

      // 임시로 읽음 상태 설정 (실제에는 별도 테이블 필요)
      const isRead = index > 3; // 최신 3개만 읽지 않은 것으로 설정

      return {
        id: log.id,
        type,
        title,
        message,
        isRead,
        priority,
        createdAt: log.created_at,
        relatedId: log.consultation_id,
        actionUrl: `/admin/consultations/${log.consultation_id}`
      };
    });

    // 읽지 않은 알림만 필터링
    if (unreadOnly) {
      return notifications.filter(n => !n.isRead);
    }

    return notifications;
  } catch (error) {
    console.error('Error generating notifications:', error);
    return [];
  }
};

// 알림 콘텐츠 생성 함수
const generateNotificationContent = (
  action: string,
  contactName: string,
  contactCompany: string | null
): { title: string; message: string } => {
  const company = contactCompany ? `${contactCompany}에서 ` : '';
  const customerName = contactName || '고객';

  switch (action) {
    case 'created':
      return {
        title: '새로운 상담 요청',
        message: `${company}새로운 상담을 요청했습니다.`
      };
    case 'status_changed':
      return {
        title: '상담 상태 변경',
        message: `${customerName}님 상담 상태가 변경되었습니다.`
      };
    case 'assigned':
      return {
        title: '새로운 배정',
        message: `${customerName}님 상담이 배정되었습니다.`
      };
    case 'contacted':
      return {
        title: '고객 연락',
        message: `${customerName}님과 연락이 진행되었습니다.`
      };
    case 'completed':
      return {
        title: '상담 완료',
        message: `${customerName}님 상담이 완료되었습니다.`
      };
    default:
      return {
        title: '상담 업데이트',
        message: `${customerName}님 상담에 업데이트가 있습니다.`
      };
  }
};

// 메모리 내 알림 상태 관리 (임시)
let notificationReadStatus: Set<string> = new Set();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res);
      case 'PUT':
        return handlePut(req, res);
      case 'POST':
        return handlePost(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Notifications API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET - 알림 목록 조회
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { limit = '20', unreadOnly = 'false' } = req.query;

  try {
    const limitNum = parseInt(limit as string, 10);
    const isUnreadOnly = unreadOnly === 'true';

    const notifications = await generateNotifications(isUnreadOnly, limitNum);

    // 읽음 상태 적용
    const processedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: notificationReadStatus.has(notification.id) || notification.isRead
    }));

    const unreadCount = processedNotifications.filter(n => !n.isRead).length;

    const response: NotificationsResponse = {
      notifications: processedNotifications,
      unreadCount,
      totalCount: processedNotifications.length
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Failed to fetch notifications',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// PUT - 개별 알림 읽음 처리
function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { action, id } = req.query;

  if (action === 'read' && id) {
    // 메모리에 읽음 상태 저장
    notificationReadStatus.add(id as string);

    return res.status(200).json({
      message: 'Notification marked as read',
      id
    });
  }

  return res.status(400).json({ error: 'Invalid action or missing ID' });
}

// POST - 모든 알림 읽음 처리
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.body;

  if (action === 'mark_all_read') {
    try {
      // 모든 알림 ID 가져오기
      const allNotifications = await generateNotifications(false, 100);

      // 모든 알림을 읽음으로 표시
      allNotifications.forEach(notification => {
        notificationReadStatus.add(notification.id);
      });

      return res.status(200).json({
        message: 'All notifications marked as read',
        updatedCount: allNotifications.length
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to mark all notifications as read',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}