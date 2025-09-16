/**
 * VisionMakers 상담 시스템 - 공통 상수
 * DRY 원칙을 위한 중앙 집중식 상수 관리
 */

// 연락처 정보
export const CONTACT_INFO = {
  PHONE: '010-9915-4724',
  BUSINESS_HOURS: '평일 오전 9시~오후 6시',
  SOCIAL_LINKS: {
    INSTAGRAM: 'https://www.instagram.com/visionmakers_official',
    BLOG: 'https://blog.naver.com/visionmakers'
  }
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  CONSULTATION_START: '/consultation/start',
  GUIDED_STEP_1: '/consultation/guided/step1',
  GUIDED_STEP_2: '/consultation/guided/step2',
  GUIDED_STEP_3: '/consultation/guided/step3',
  GUIDED_STEP_4: '/consultation/guided/step4',
  FREE_WRITE: '/consultation/free/write',
  THANKS: '/consultation/thanks',
  PRIVACY_POLICY: '/privacy-policy'
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  CONSULTATION_SUBMIT: '/api/consultation-submit',
  SLACK_WEBHOOK: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || 'https://us-central1-vison-makers.cloudfunctions.net/sendMessageToSlack'
} as const;

// 유효성 검사 상수
export const VALIDATION_CONSTANTS = {
  MIN_DESCRIPTION_LENGTH: 20,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_ADDITIONAL_REQUESTS_LENGTH: 500,
  PHONE_REGEX: /^[0-9-+\s]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// 테마 색상
export const THEME_COLORS = {
  PRIMARY: 'red-500',
  PRIMARY_HOVER: 'red-600',
  PRIMARY_FOCUS: 'red-500',
  PRIMARY_LIGHT: 'red-50',
  PRIMARY_TEXT: 'red-700',
  SECONDARY: 'gray-500',
  SECONDARY_HOVER: 'gray-600',
  SUCCESS: 'green-500',
  ERROR: 'red-500',
  WARNING: 'yellow-500',
  INFO: 'blue-500'
} as const;

// 시간 관련 상수
export const TIME_CONSTANTS = {
  CONSULTATION_RESPONSE_TIME: '1-2일',
  ESTIMATED_GUIDED_TIME: '2-3분',
  ESTIMATED_FREE_TIME: '1-2분',
  DATA_RETENTION_PERIOD: '1년'
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  CONSULTATION_STATE: 'visionmakers-consultation-state'
} as const;