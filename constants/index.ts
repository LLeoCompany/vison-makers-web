/**
 * LeoFitTech 상담 시스템 상수 정의
 * 설계 문서 기반 테마 색상 및 기본 상수들
 */

// 테마 색상 상수
export const THEME_COLORS = {
  // Primary Colors
  PRIMARY: "red-500",
  PRIMARY_DARK: "red-600",
  PRIMARY_LIGHT: "red-400",
  PRIMARY_FOCUS: "red-600",

  // Semantic Colors
  SUCCESS: "green-500",
  SUCCESS_DARK: "green-600",
  WARNING: "yellow-500",
  WARNING_DARK: "yellow-600",
  ERROR: "red-500",
  ERROR_DARK: "red-600",
  INFO: "blue-500",
  INFO_DARK: "blue-600",

  // Neutral Colors
  GRAY_50: "gray-50",
  GRAY_100: "gray-100",
  GRAY_200: "gray-200",
  GRAY_300: "gray-300",
  GRAY_400: "gray-400",
  GRAY_500: "gray-500",
  GRAY_600: "gray-600",
  GRAY_700: "gray-700",
  GRAY_800: "gray-800",
  GRAY_900: "gray-900",

  // Background Colors
  BG_WHITE: "white",
  BG_GRAY: "gray-50",
  BG_PRIMARY: "red-50",
};

// 폼 검증 상수
export const VALIDATION_RULES = {
  // 이름 검증
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,

  // 전화번호 검증
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,

  // 이메일 검증
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // 프로젝트 설명 검증
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 1000,

  // 회사명 검증
  COMPANY_MAX_LENGTH: 100,
};

// API 상수
export const API_ENDPOINTS = {
  CONSULTATION_SUBMIT: "/api/consultation-submit",
  CONSULTATION_STATUS: "/api/consultation-status",
  AB_TEST: "/api/analytics/ab-test",
  REAL_TIME_METRICS: "/api/analytics/real-time-metrics",
};

// 로컬스토리지 키
export const STORAGE_KEYS = {
  CONSULTATION_DRAFT: "consultation_draft",
  USER_PREFERENCES: "user_preferences",
  AB_TEST_VARIANT: "ab_test_variant",
  LAST_SUBMISSION_TIME: "last_submission_time",
  SCROLL_MILESTONES: "scroll_milestones",
};

// 애니메이션 상수
export const ANIMATION = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    DEFAULT: "ease",
    IN: "ease-in",
    OUT: "ease-out",
    IN_OUT: "ease-in-out",
  },
};

// 브레이크포인트 상수
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1440,
};

// 상담 시스템 상수
export const CONSULTATION = {
  // 단계별 제한시간 (분)
  STEP_TIMEOUT: 30,

  // 재시도 설정
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // 중복 제출 방지 (밀리초)
  DUPLICATE_PREVENTION_TIME: 5000,

  // 예상 처리 시간
  ESTIMATED_PROCESSING: {
    GUIDED: "2-4시간 내",
    FREE: "4-8시간 내",
  },

  // 영업시간
  BUSINESS_HOURS: {
    START: 9,
    END: 18,
    WEEKDAYS: [1, 2, 3, 4, 5], // 월-금
  },
};

// 마케팅 상수
export const MARKETING = {
  // A/B 테스트 변형 비율
  AB_TEST_SPLIT: 0.5,

  // 전환 추적 이벤트
  EVENTS: {
    PAGE_VIEW: "page_view",
    CTA_CLICKED: "cta_clicked",
    FORM_STARTED: "form_started",
    FORM_COMPLETED: "form_completed",
    CONSULTATION_SUBMITTED: "consultation_submitted",
    EXIT_INTENT: "exit_intent_triggered",
  },

  // 스크롤 깊이 마일스톤
  SCROLL_MILESTONES: [25, 50, 75, 100],

  // 최적화 임계값
  OPTIMIZATION_THRESHOLDS: {
    CONVERSION_RATE: 2.0,
    BOUNCE_RATE: 60,
    CTA_CLICK_RATE: 5,
    FORM_ABANDONMENT_RATE: 30,
    SCROLL_DEPTH: 50,
  },
};
