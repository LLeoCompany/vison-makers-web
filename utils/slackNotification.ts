/**
 * 슬랙 알림 시스템 유틸리티
 */

import { IncomingWebhook } from '@slack/webhook';
import type {
  SlackNotificationData,
  SlackMessage,
  NotificationResult,
  SlackConfig,
  ErrorNotificationData,
  DailySummaryData,
  SlackApiError
} from '@/types/slack';

// 슬랙 설정 로드
function getSlackConfig(): SlackConfig {
  return {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || '',
    channel: process.env.SLACK_CHANNEL || '#상담신청',
    username: process.env.SLACK_USERNAME || '상담알림봇',
    iconEmoji: process.env.SLACK_ICON_EMOJI || ':bell:',
    enabled: !!process.env.SLACK_WEBHOOK_URL && process.env.SLACK_WEBHOOK_URL !== 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
  };
}

// 슬랙 웹훅 인스턴스 생성
function createWebhookInstance(): IncomingWebhook | null {
  const config = getSlackConfig();

  if (!config.enabled) {
    console.warn('슬랙 알림이 비활성화되어 있습니다. SLACK_WEBHOOK_URL을 확인하세요.');
    return null;
  }

  try {
    return new IncomingWebhook(config.webhookUrl, {
      username: config.username,
      channel: config.channel,
      icon_emoji: config.iconEmoji
    });
  } catch (error) {
    console.error('슬랙 웹훅 인스턴스 생성 실패:', error);
    return null;
  }
}

// 개인정보 마스킹 함수
function maskSensitiveData(data: SlackNotificationData): SlackNotificationData {
  return {
    ...data,
    email: maskEmail(data.email),
    phone: maskPhone(data.phone)
  };
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;

  const [local, domain] = email.split('@');
  if (local.length <= 2) return email;

  const maskedLocal = local.charAt(0) + '*'.repeat(Math.max(local.length - 2, 1)) + local.charAt(local.length - 1);
  return `${maskedLocal}@${domain}`;
}

function maskPhone(phone: string): string {
  if (!phone) return phone;

  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  if (numbers.length !== 11) return phone;

  // 010-****-1234 형식으로 마스킹
  return `${numbers.slice(0, 3)}-****-${numbers.slice(-4)}`;
}

// 메시지 발송 함수
export async function sendSlackMessage(message: SlackMessage): Promise<NotificationResult> {
  const webhook = createWebhookInstance();

  if (!webhook) {
    return {
      success: false,
      error: '슬랙 웹훅이 설정되지 않았습니다.',
      timestamp: new Date()
    };
  }

  try {
    const result = await webhook.send(message);

    return {
      success: true,
      messageId: (result as any).ts || undefined,
      timestamp: new Date()
    };
  } catch (error) {
    const slackError = error as SlackApiError;
    console.error('슬랙 메시지 발송 실패:', slackError);

    return {
      success: false,
      error: slackError.message || '슬랙 메시지 발송 중 오류가 발생했습니다.',
      timestamp: new Date()
    };
  }
}

// 상담신청 알림 발송
export async function sendConsultationNotification(data: SlackNotificationData): Promise<NotificationResult> {
  try {
    // 개인정보 마스킹 (선택사항 - 내부 채널이면 마스킹하지 않을 수도 있음)
    const shouldMask = process.env.SLACK_MASK_SENSITIVE_DATA === 'true';
    const notificationData = shouldMask ? maskSensitiveData(data) : data;

    // 메시지 템플릿 동적 import
    const { createConsultationMessage } = await import('./notificationTemplates');
    const message = createConsultationMessage(notificationData);

    return await sendSlackMessage(message);
  } catch (error) {
    console.error('상담신청 알림 발송 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date()
    };
  }
}

// 에러 알림 발송
export async function sendErrorNotification(errorData: ErrorNotificationData): Promise<NotificationResult> {
  try {
    const { createErrorMessage } = await import('./notificationTemplates');
    const message = createErrorMessage(errorData);

    return await sendSlackMessage(message);
  } catch (error) {
    console.error('에러 알림 발송 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date()
    };
  }
}

// 일일 요약 알림 발송
export async function sendDailySummary(summaryData: DailySummaryData): Promise<NotificationResult> {
  try {
    const { createDailySummaryMessage } = await import('./notificationTemplates');
    const message = createDailySummaryMessage(summaryData);

    return await sendSlackMessage(message);
  } catch (error) {
    console.error('일일 요약 알림 발송 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date()
    };
  }
}

// 긴급 알림 발송 (우선순위 높은 상담)
export async function sendUrgentNotification(data: SlackNotificationData): Promise<NotificationResult> {
  try {
    const { createUrgentConsultationMessage } = await import('./notificationTemplates');
    const message = createUrgentConsultationMessage(data);

    return await sendSlackMessage(message);
  } catch (error) {
    console.error('긴급 알림 발송 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      timestamp: new Date()
    };
  }
}

// 테스트 메시지 발송
export async function sendTestNotification(): Promise<NotificationResult> {
  const testMessage: SlackMessage = {
    text: '🧪 슬랙 알림 시스템 테스트',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🧪 테스트 알림'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '슬랙 알림 시스템이 정상적으로 작동하고 있습니다.'
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `📅 테스트 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
          }
        ]
      }
    ]
  };

  return await sendSlackMessage(testMessage);
}

// 알림 상태 확인
export function isSlackNotificationEnabled(): boolean {
  const config = getSlackConfig();
  return config.enabled;
}

// 설정 정보 반환 (민감한 정보 제외)
export function getSlackStatus() {
  const config = getSlackConfig();
  return {
    enabled: config.enabled,
    channel: config.channel,
    username: config.username,
    iconEmoji: config.iconEmoji,
    webhookConfigured: !!config.webhookUrl && config.webhookUrl !== 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
  };
}

// 에러 발생 시 자동 알림 (간편 함수)
export async function notifyError(error: string, context: string = 'unknown'): Promise<void> {
  try {
    await sendErrorNotification({
      error,
      context,
      timestamp: new Date().toISOString()
    });
  } catch (notificationError) {
    // 알림 발송 실패 시에도 원본 오류가 중요하므로 로그만 남김
    console.error('에러 알림 발송 중 오류 발생:', notificationError);
  }
}