/**
 * 관리자 알림 트리거 유틸리티
 * 상담 생성/업데이트 시 자동으로 알림 생성
 */

import { supabaseAdmin } from '@/lib/supabase';
import type { ConsultationStatus, ConsultationPriority } from '@/types/database';
import { sendConsultationNotification, sendUrgentNotification, notifyError } from './slackNotification';
import type { SlackNotificationData } from '@/types/slack';

export interface NotificationTriggerData {
  consultationId: string;
  action: 'created' | 'status_changed' | 'assigned' | 'contacted' | 'completed' | 'cancelled';
  actorType?: 'system' | 'admin' | 'api';
  actorId?: string;
  details?: Record<string, any>;
}

/**
 * 상담 관련 이벤트 발생 시 관리자 알림 생성
 */
export const triggerAdminNotification = async (data: NotificationTriggerData): Promise<void> => {
  try {
    // 상담 로그에 기록 (이미 consultation-submit.ts에서 수행됨)
    const { error: logError } = await supabaseAdmin
      .from('consultation_logs')
      .insert({
        consultation_id: data.consultationId,
        action: data.action,
        details: data.details || {},
        actor_type: data.actorType || 'system',
        actor_id: data.actorId || null
      });

    if (logError) {
      console.error('Failed to create consultation log:', logError);
    }

    // 알림이 필요한 액션인지 확인
    const notificationActions = ['created', 'status_changed', 'assigned'];
    if (!notificationActions.includes(data.action)) {
      return;
    }

    // 실시간 알림 전송 (WebSocket 또는 Server-Sent Events)
    await sendRealTimeNotification(data);

    // 슬랙 알림 전송 (새로운 상담 시에만)
    if (data.action === 'created') {
      await sendSlackNotificationForConsultation(data.consultationId);
    }

  } catch (error) {
    console.error('Failed to trigger admin notification:', error);
  }
};

/**
 * 실시간 알림 전송 (향후 WebSocket 구현시 사용)
 */
const sendRealTimeNotification = async (data: NotificationTriggerData): Promise<void> => {
  try {
    // 상담 정보 조회
    const { data: consultation, error } = await supabaseAdmin
      .from('consultation_details')
      .select('*')
      .eq('id', data.consultationId)
      .single();

    if (error || !consultation) {
      console.error('Failed to fetch consultation for notification:', error);
      return;
    }

    // 알림 페이로드 생성
    const notificationPayload = {
      id: `notification-${Date.now()}`,
      type: getNotificationType(data.action),
      title: getNotificationTitle(data.action),
      message: getNotificationMessage(data.action, consultation),
      isRead: false,
      priority: getNotificationPriority(consultation.priority, data.action),
      createdAt: new Date().toISOString(),
      relatedId: data.consultationId,
      actionUrl: `/admin/consultations/${data.consultationId}`,
      metadata: {
        ...data.details,
        consultationNumber: consultation.consultation_number,
        customerName: consultation.contact_name,
        customerCompany: consultation.contact_company
      }
    };

    // TODO: WebSocket을 통한 실시간 전송 구현
    // await sendToAdminClients(notificationPayload);

    // 임시로 콘솔에 로그 출력
    console.log('Real-time notification:', notificationPayload);

  } catch (error) {
    console.error('Failed to send real-time notification:', error);
  }
};

/**
 * 액션에 따른 알림 타입 결정
 */
const getNotificationType = (action: string): string => {
  const typeMap: Record<string, string> = {
    created: 'new_consultation',
    status_changed: 'status_update',
    assigned: 'assignment',
    contacted: 'system',
    completed: 'system',
    cancelled: 'system'
  };
  return typeMap[action] || 'system';
};

/**
 * 액션에 따른 알림 제목 생성
 */
const getNotificationTitle = (action: string): string => {
  const titleMap: Record<string, string> = {
    created: '새로운 상담 요청',
    status_changed: '상담 상태 변경',
    assigned: '담당자 배정',
    contacted: '고객 연락',
    completed: '상담 완료',
    cancelled: '상담 취소'
  };
  return titleMap[action] || '상담 업데이트';
};

/**
 * 액션과 상담 정보에 따른 알림 메시지 생성
 */
const getNotificationMessage = (action: string, consultation: any): string => {
  const customerName = consultation.contact_name || '고객';
  const company = consultation.contact_company;
  const companyText = company ? `${company}에서 ` : '';

  switch (action) {
    case 'created':
      return `${companyText}새로운 상담을 요청했습니다.`;
    case 'status_changed':
      return `${customerName}님 상담 상태가 변경되었습니다.`;
    case 'assigned':
      return `${customerName}님 상담에 담당자가 배정되었습니다.`;
    case 'contacted':
      return `${customerName}님과 연락이 진행되었습니다.`;
    case 'completed':
      return `${customerName}님 상담이 완료되었습니다.`;
    case 'cancelled':
      return `${customerName}님 상담이 취소되었습니다.`;
    default:
      return `${customerName}님 상담에 업데이트가 있습니다.`;
  }
};

/**
 * 상담 우선순위와 액션에 따른 알림 우선순위 결정
 */
const getNotificationPriority = (
  consultationPriority: ConsultationPriority,
  action: string
): 'low' | 'medium' | 'high' | 'urgent' => {
  // 새로운 상담이고 긴급한 경우
  if (action === 'created' && consultationPriority === 'urgent') {
    return 'urgent';
  }

  // 새로운 상담이고 높은 우선순위인 경우
  if (action === 'created' && consultationPriority === 'high') {
    return 'high';
  }

  // 새로운 상담인 경우 기본적으로 중간 우선순위
  if (action === 'created') {
    return 'medium';
  }

  // 상담 우선순위를 기반으로 결정
  switch (consultationPriority) {
    case 'urgent':
      return 'urgent';
    case 'high':
      return 'high';
    case 'normal':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'medium';
  }
};

/**
 * 상담 생성 시 자동 알림 트리거
 */
export const triggerNewConsultationNotification = async (
  consultationId: string,
  priority: ConsultationPriority = 'normal'
): Promise<void> => {
  await triggerAdminNotification({
    consultationId,
    action: 'created',
    actorType: 'system',
    details: {
      priority,
      source: 'web_form',
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * 상담 상태 변경 시 자동 알림 트리거
 */
export const triggerStatusChangeNotification = async (
  consultationId: string,
  fromStatus: ConsultationStatus,
  toStatus: ConsultationStatus,
  actorId?: string
): Promise<void> => {
  await triggerAdminNotification({
    consultationId,
    action: 'status_changed',
    actorType: 'admin',
    actorId,
    details: {
      fromStatus,
      toStatus,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * 담당자 배정 시 자동 알림 트리거
 */
export const triggerAssignmentNotification = async (
  consultationId: string,
  assignedTo: string,
  actorId?: string
): Promise<void> => {
  await triggerAdminNotification({
    consultationId,
    action: 'assigned',
    actorType: 'admin',
    actorId,
    details: {
      assignedTo,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * 상담 정보를 기반으로 슬랙 알림 전송
 */
const sendSlackNotificationForConsultation = async (consultationId: string): Promise<void> => {
  try {
    // 상담 상세 정보 조회
    const { data: consultation, error } = await supabaseAdmin
      .from('consultation_details')
      .select('*')
      .eq('id', consultationId)
      .single();

    if (error || !consultation) {
      console.error('Failed to fetch consultation for Slack notification:', error);
      await notifyError(
        `슬랙 알림용 상담 정보 조회 실패: ${error?.message || 'Unknown error'}`,
        'sendSlackNotificationForConsultation'
      );
      return;
    }

    // 슬랙 알림 데이터 변환
    const slackData: SlackNotificationData = {
      consultationType: consultation.type as 'guided' | 'free',
      consultationNumber: consultation.consultation_number,
      clientName: consultation.contact_name,
      email: consultation.contact_email,
      phone: consultation.contact_phone,
      company: consultation.contact_company || undefined,
      serviceType: consultation.service_type || undefined,
      budget: consultation.budget || undefined,
      timeline: consultation.timeline || undefined,
      projectDescription: consultation.project_description || undefined,
      additionalRequests: consultation.additional_requests || undefined,
      importantFeatures: consultation.important_features || undefined,
      projectSize: consultation.project_size || undefined,
      createdAt: consultation.created_at,
      utmSource: consultation.utm_source || undefined,
      utmMedium: consultation.utm_medium || undefined,
      utmCampaign: consultation.utm_campaign || undefined
    };

    // 우선순위에 따라 적절한 알림 함수 선택
    const isUrgent = consultation.priority === 'urgent' || consultation.priority === 'high';

    const result = isUrgent
      ? await sendUrgentNotification(slackData)
      : await sendConsultationNotification(slackData);

    if (!result.success) {
      console.error('Slack notification failed:', result.error);
      await notifyError(
        `슬랙 알림 발송 실패: ${result.error}`,
        'sendSlackNotificationForConsultation'
      );
    } else {
      console.log('Slack notification sent successfully for consultation:', consultation.consultation_number);
    }

  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    await notifyError(
      `슬랙 알림 처리 중 오류: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'sendSlackNotificationForConsultation'
    );
  }
};

export default {
  triggerAdminNotification,
  triggerNewConsultationNotification,
  triggerStatusChangeNotification,
  triggerAssignmentNotification,
  sendSlackNotificationForConsultation
};