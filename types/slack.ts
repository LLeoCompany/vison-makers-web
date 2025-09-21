/**
 * 슬랙 알림 시스템 타입 정의
 */

// 슬랙 블록 요소 타입
export interface SlackTextElement {
  type: 'plain_text' | 'mrkdwn';
  text: string;
  emoji?: boolean;
}

export interface SlackFieldElement {
  type: 'mrkdwn';
  text: string;
}

export interface SlackButtonElement {
  type: 'button';
  text: SlackTextElement;
  url?: string;
  value?: string;
  action_id?: string;
  style?: 'primary' | 'danger';
}

export interface SlackContextElement {
  type: 'mrkdwn' | 'plain_text';
  text: string;
}

// 슬랙 블록 타입
export interface SlackHeaderBlock {
  type: 'header';
  text: SlackTextElement;
}

export interface SlackSectionBlock {
  type: 'section';
  text?: SlackTextElement;
  fields?: SlackFieldElement[];
}

export interface SlackActionsBlock {
  type: 'actions';
  elements: SlackButtonElement[];
}

export interface SlackContextBlock {
  type: 'context';
  elements: SlackContextElement[];
}

export interface SlackDividerBlock {
  type: 'divider';
}

export type SlackBlock =
  | SlackHeaderBlock
  | SlackSectionBlock
  | SlackActionsBlock
  | SlackContextBlock
  | SlackDividerBlock;

// 슬랙 메시지 타입
export interface SlackMessage {
  text: string;
  blocks?: SlackBlock[];
  username?: string;
  channel?: string;
  icon_emoji?: string;
  icon_url?: string;
}

// 상담신청 데이터 타입
export interface SlackNotificationData {
  consultationType: 'guided' | 'free';
  consultationNumber: string;
  clientName: string;
  email: string;
  phone: string;
  company?: string;
  projectType?: string;
  serviceType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  projectDescription?: string;
  additionalRequests?: string;
  importantFeatures?: string[];
  projectSize?: string;
  createdAt: string;
  clientIp?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

// 일일 요약 데이터 타입
export interface DailySummaryData {
  date: string;
  totalConsultations: number;
  guidedConsultations: number;
  freeConsultations: number;
  pendingCount: number;
  topProjectTypes: Array<{
    type: string;
    count: number;
  }>;
  topBudgetRanges: Array<{
    range: string;
    count: number;
  }>;
}

// 알림 큐 작업 타입
export interface NotificationJob {
  id: string;
  type: 'consultation' | 'error' | 'summary' | 'urgent';
  data: SlackNotificationData | DailySummaryData | ErrorNotificationData;
  retryCount: number;
  maxRetries: number;
  scheduledAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
}

// 에러 알림 데이터 타입
export interface ErrorNotificationData {
  error: string;
  context: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  stack?: string;
}

// 슬랙 웹훅 응답 타입
export interface SlackWebhookResponse {
  ok: boolean;
  error?: string;
}

// 슬랙 설정 타입
export interface SlackConfig {
  webhookUrl: string;
  channel: string;
  username: string;
  iconEmoji: string;
  enabled: boolean;
}

// 알림 로그 타입
export interface NotificationLog {
  id: string;
  consultationId?: string;
  notificationType: 'consultation' | 'error' | 'summary' | 'urgent';
  status: 'sent' | 'failed' | 'retrying';
  errorMessage?: string;
  sentAt?: Date;
  retryCount: number;
  createdAt: Date;
}

// 메시지 템플릿 타입
export type MessageTemplate = (data: SlackNotificationData) => SlackMessage;
export type ErrorMessageTemplate = (data: ErrorNotificationData) => SlackMessage;
export type SummaryMessageTemplate = (data: DailySummaryData) => SlackMessage;

// 알림 결과 타입
export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: Date;
}

// 슬랙 API 에러 타입
export interface SlackApiError extends Error {
  code?: string;
  response?: {
    status: number;
    statusText: string;
    data?: any;
  };
}