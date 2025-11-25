/**
 * LeoFitTech 상담 시스템 타입 정의
 * 설계 문서 4. 데이터 구조 설계 기반
 */

// 공통 타입
export type TrackType = "guided" | "free";

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  company?: string;
  preferredContactTime: "morning" | "afternoon" | "evening" | "anytime";
}

// 가이드 트랙 타입
export type ServiceType =
  | "homepage"
  | "shopping"
  | "booking"
  | "membership"
  | "web_development"
  | "mobile_app"
  | "desktop_app"
  | "ai_ml"
  | "blockchain"
  | "iot"
  | "consulting"
  | "maintenance"
  | "other";
export type ProjectSize = "small" | "medium" | "large";
export type Budget =
  | "under_1000"
  | "1000_to_3000"
  | "3000_to_5000"
  | "5000_to_10000"
  | "over_10000"
  | "negotiable";
export type Timeline =
  | "asap"
  | "1_month"
  | "1_3_months"
  | "3_6_months"
  | "6_12_months"
  | "over_1_year"
  | "flexible";

export type ImportantFeature = "mobile" | "seo" | "admin" | "payment";

export interface GuidedConsultation {
  // 메타 정보
  id: string;
  type: "guided";
  submittedAt: Date;
  userAgent: string;
  referrer: string;

  // Step 1: 서비스 종류
  serviceType: ServiceType;

  // Step 2: 규모와 예산
  projectSize: ProjectSize;
  budget: Budget;

  // Step 3: 일정과 특별 요청
  timeline: Timeline;
  importantFeatures: ImportantFeature[];
  additionalRequests?: string;

  // Step 4: 연락처
  contact: ContactInfo;
}

// 자유 트랙 타입
// API 요청/응답 타입
export interface ConsultationRequest {
  type: TrackType;
  contact: ContactInfo;
  serviceType?: ServiceType;
  projectSize?: ProjectSize;
  budget?: Budget | string;
  timeline?: Timeline | string;
  importantFeatures?: ImportantFeature[];
  additionalRequests?: string;
  projectDescription?: string;
  metadata?: {
    userAgent: string;
    referrer: string;
    timestamp: string;
    screenResolution?: string;
    timezone?: string;
    language?: string;
    platform?: string;
  };
}

export interface ConsultationResponse {
  success: boolean;
  message?: string;
  data: {
    consultationId: string;
    consultationNumber: string;
    estimatedContactTime: string;
  };
  error?: any;
}

export interface FreeConsultation {
  // 메타 정보
  id: string;
  type: "free";
  submittedAt: Date;
  userAgent: string;
  referrer: string;

  // 자유 작성 내용
  description: string;

  // 연락처
  contact: ContactInfo;
}

// 전체 상담 데이터 타입
export type ConsultationData = GuidedConsultation | FreeConsultation;

// 두 번째 중복 정의 제거 - 첫 번째 정의 사용

// 상태 관리용 타입
export interface ConsultationState {
  trackType: TrackType | null;
  currentStep: number;
  totalSteps: number;
  isLoading: boolean;
  error: string | null;

  // 가이드 트랙 상태
  guided: {
    serviceType: ServiceType | null;
    projectSize: ProjectSize | null;
    budget: Budget | null;
    timeline: Timeline | null;
    importantFeatures: ImportantFeature[];
    additionalRequests: string;
    contact: Partial<ContactInfo>;
  };

  // 자유 트랙 상태
  free: {
    description: string;
    contact: Partial<ContactInfo>;
  };
}

// 액션 타입
export type ConsultationAction =
  | { type: "SET_TRACK_TYPE"; payload: TrackType }
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_GUIDED_SERVICE_TYPE"; payload: ServiceType }
  | { type: "SET_GUIDED_PROJECT_SIZE"; payload: ProjectSize }
  | { type: "SET_GUIDED_BUDGET"; payload: Budget }
  | { type: "SET_GUIDED_TIMELINE"; payload: Timeline }
  | { type: "SET_GUIDED_FEATURES"; payload: ImportantFeature[] }
  | { type: "SET_GUIDED_ADDITIONAL_REQUESTS"; payload: string }
  | { type: "SET_GUIDED_CONTACT"; payload: Partial<ContactInfo> }
  | { type: "SET_FREE_DESCRIPTION"; payload: string }
  | { type: "SET_FREE_CONTACT"; payload: Partial<ContactInfo> }
  | { type: "RESET_STATE" }
  | { type: "LOAD_FROM_STORAGE"; payload: ConsultationState };

// 로컬 스토리지 키
export const STORAGE_KEY = "LeoFitTech_consultation_state";

// 서비스 타입별 설명
export const SERVICE_TYPE_DESCRIPTIONS = {
  homepage: "회사 소개, 브랜드 홍보, 포트폴리오 사이트",
  shopping: "온라인 상품 판매, 장바구니, 결제 시스템",
  booking: "병원, 미용실, 펜션, 레스토랑 예약 시스템",
  membership: "커뮤니티, 학습 플랫폼, 회원제 서비스",
  web_development: "웹사이트 개발 (홈페이지, 쇼핑몰 등)",
  mobile_app: "모바일 앱 개발 (iOS, Android)",
  desktop_app: "데스크탑 애플리케이션 개발",
  ai_ml: "AI/머신러닝 솔루션",
  blockchain: "블록체인 기술 구현",
  iot: "IoT 시스템 개발",
  consulting: "IT 컨설팅 서비스",
  maintenance: "시스템 유지보수",
  other: "특별한 요구사항이 있는 프로젝트",
} as const;

// 프로젝트 규모별 설명
export const PROJECT_SIZE_DESCRIPTIONS = {
  small: "간단하게 (5-10 페이지 정도)",
  medium: "보통 규모 (10-20 페이지)",
  large: "큰 규모 (20페이지 이상, 복잡한 기능)",
} as const;

// 예산 범위별 설명
export const BUDGET_DESCRIPTIONS = {
  under_1000: "100만원 미만",
  "1000_to_3000": "100-300만원",
  "3000_to_5000": "300-500만원",
  "5000_to_10000": "500-1000만원",
  over_10000: "1000만원 이상",
  negotiable: "상담받고 정하고 싶어요",
} as const;

// 일정별 설명
export const TIMELINE_DESCRIPTIONS = {
  asap: "최대한 빨리 (급해요!)",
  "1_month": "1개월 이내",
  "1_3_months": "1-3개월 정도",
  "3_6_months": "3-6개월 이내",
  "6_12_months": "6-12개월 이내",
  over_1_year: "1년 이상",
  flexible: "일정은 상관없어요",
} as const;

// 중요 기능별 설명
export const FEATURE_DESCRIPTIONS = {
  mobile: "모바일에서 잘 보이게",
  seo: "네이버/구글 검색 잘 되게",
  admin: "관리자 페이지",
  payment: "결제 기능",
} as const;

// 연락 시간별 설명
export const CONTACT_TIME_DESCRIPTIONS = {
  morning: "평일 오전 (9시-12시)",
  afternoon: "평일 오후 (1시-6시)",
  evening: "평일 저녁 (6시-8시)",
  anytime: "언제든 괜찮아요",
} as const;
