/**
 * VisionMakers 상담 시스템 타입 정의
 * 설계 문서 4. 데이터 구조 설계 기반
 */

// 공통 타입
export type TrackType = 'guided' | 'free';

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  company?: string;
  preferredContactTime: 'morning' | 'afternoon' | 'evening' | 'anytime';
}

// 가이드 트랙 타입
export type ServiceType = 'homepage' | 'shopping' | 'booking' | 'membership' | 'other';
export type ProjectSize = 'small' | 'medium' | 'large';
export type Budget = '100-300' | '300-800' | '800-1500' | '1500+' | 'consult';
export type Timeline = '1month' | '2-3months' | '6months' | 'flexible';

export type ImportantFeature = 'mobile' | 'seo' | 'admin' | 'payment';

export interface GuidedConsultation {
  // 메타 정보
  id: string;
  type: 'guided';
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
export interface FreeConsultation {
  // 메타 정보
  id: string;
  type: 'free';
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

// API 응답 타입
export interface ConsultationResponse {
  success: boolean;
  message: string;
  consultationId: string;
  estimatedResponseTime: string;
}

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
  | { type: 'SET_TRACK_TYPE'; payload: TrackType }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_GUIDED_SERVICE_TYPE'; payload: ServiceType }
  | { type: 'SET_GUIDED_PROJECT_SIZE'; payload: ProjectSize }
  | { type: 'SET_GUIDED_BUDGET'; payload: Budget }
  | { type: 'SET_GUIDED_TIMELINE'; payload: Timeline }
  | { type: 'SET_GUIDED_FEATURES'; payload: ImportantFeature[] }
  | { type: 'SET_GUIDED_ADDITIONAL_REQUESTS'; payload: string }
  | { type: 'SET_GUIDED_CONTACT'; payload: Partial<ContactInfo> }
  | { type: 'SET_FREE_DESCRIPTION'; payload: string }
  | { type: 'SET_FREE_CONTACT'; payload: Partial<ContactInfo> }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_FROM_STORAGE'; payload: ConsultationState };

// 로컬 스토리지 키
export const STORAGE_KEY = 'visionmakers_consultation_state';

// 서비스 타입별 설명
export const SERVICE_TYPE_DESCRIPTIONS = {
  homepage: '브랜드 소개, 서비스 안내용 웹사이트',
  shopping: '상품을 온라인으로 판매하는 사이트',
  booking: '병원, 미용실, 레스토랑 등의 예약 관리',
  membership: '로그인, 커뮤니티, 개인정보 관리 기능',
  other: '전화 상담으로 함께 알아보기'
} as const;

// 프로젝트 규모별 설명
export const PROJECT_SIZE_DESCRIPTIONS = {
  small: '간단하게 (5-10 페이지 정도)',
  medium: '보통 규모 (10-20 페이지)',
  large: '큰 규모 (20페이지 이상, 복잡한 기능)'
} as const;

// 예산 범위별 설명
export const BUDGET_DESCRIPTIONS = {
  '100-300': '100-300만원',
  '300-800': '300-800만원',
  '800-1500': '800-1500만원',
  '1500+': '1500만원 이상',
  'consult': '상담받고 정하고 싶어요'
} as const;

// 일정별 설명
export const TIMELINE_DESCRIPTIONS = {
  '1month': '1개월 이내 (급해요!)',
  '2-3months': '2-3개월 정도 (적당히)',
  '6months': '6개월 이내 (여유있게)',
  'flexible': '일정은 상관없어요'
} as const;

// 중요 기능별 설명
export const FEATURE_DESCRIPTIONS = {
  mobile: '모바일에서 잘 보이게',
  seo: '네이버/구글 검색 잘 되게',
  admin: '관리자 페이지',
  payment: '결제 기능'
} as const;

// 연락 시간별 설명
export const CONTACT_TIME_DESCRIPTIONS = {
  morning: '평일 오전 (9시-12시)',
  afternoon: '평일 오후 (1시-6시)',
  evening: '평일 저녁 (6시-8시)',
  anytime: '언제든 괜찮아요'
} as const;