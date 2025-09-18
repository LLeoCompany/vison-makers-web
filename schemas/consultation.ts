/**
 * 상담시스템 검증 스키마
 * Zod를 사용한 타입 안전 검증
 */

import { z } from 'zod';

// 기본 검증 규칙들
const phoneRegex = /^[0-9\-\+\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 연락처 정보 스키마
export const ContactInfoSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(100, '이름은 100자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문, 공백만 입력 가능합니다'),

  phone: z
    .string()
    .min(10, '연락처는 10자 이상이어야 합니다')
    .max(20, '연락처는 20자를 초과할 수 없습니다')
    .regex(phoneRegex, '올바른 전화번호 형식이 아닙니다')
    .refine((phone) => {
      const digitsOnly = phone.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 11;
    }, '전화번호는 10-11자리 숫자여야 합니다'),

  email: z
    .string()
    .min(5, '이메일은 5자 이상이어야 합니다')
    .max(255, '이메일은 255자를 초과할 수 없습니다')
    .regex(emailRegex, '올바른 이메일 형식이 아닙니다')
    .refine((email) => {
      const [local, domain] = email.split('@');
      return local.length <= 64 && domain.length <= 253;
    }, '이메일 형식이 올바르지 않습니다'),

  company: z
    .string()
    .max(200, '회사명은 200자를 초과할 수 없습니다')
    .optional()
    .or(z.literal('')),

  preferredContactTime: z
    .enum(['morning', 'afternoon', 'evening', 'anytime'])
    .optional(),
});

// 메타데이터 스키마
export const ConsultationMetadataSchema = z.object({
  userAgent: z.string().max(1000).optional(),
  ipAddress: z.string().max(45).optional(), // IPv6 최대 길이
  referrer: z.string().url().max(2000).optional().or(z.literal('')),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
}).optional();

// 가이드 상담 스키마
export const GuidedConsultationSchema = z.object({
  type: z.literal('guided'),

  serviceType: z.enum(['homepage', 'shopping', 'booking', 'membership', 'other'], {
    errorMap: () => ({ message: '서비스 종류를 선택해주세요' }),
  }),

  projectSize: z.enum(['small', 'medium', 'large'], {
    errorMap: () => ({ message: '프로젝트 규모를 선택해주세요' }),
  }),

  budget: z.enum(['100-300', '300-800', '800-1500', '1500+', 'consult'], {
    errorMap: () => ({ message: '예산 범위를 선택해주세요' }),
  }),

  timeline: z.enum(['1month', '2-3months', '6months', 'flexible'], {
    errorMap: () => ({ message: '완성 희망 시기를 선택해주세요' }),
  }),

  importantFeatures: z
    .array(z.enum(['mobile', 'seo', 'admin', 'payment']))
    .max(4, '중요 기능은 최대 4개까지 선택 가능합니다')
    .default([]),

  additionalRequests: z
    .string()
    .max(2000, '추가 요청사항은 2000자를 초과할 수 없습니다')
    .optional()
    .or(z.literal('')),

  contact: ContactInfoSchema,
  metadata: ConsultationMetadataSchema,
});

// 자유 상담 스키마
export const FreeConsultationSchema = z.object({
  type: z.literal('free'),

  projectDescription: z
    .string()
    .min(20, '프로젝트 설명은 최소 20자 이상 작성해주세요')
    .max(2000, '프로젝트 설명은 2000자를 초과할 수 없습니다')
    .refine((desc) => {
      // 의미있는 내용인지 간단히 체크
      const meaningfulWords = desc.trim().split(/\s+/).filter(word => word.length > 1);
      return meaningfulWords.length >= 5;
    }, '더 구체적으로 작성해주세요 (최소 5개 이상의 단어)'),

  budget: z
    .string()
    .max(200, '예산 정보는 200자를 초과할 수 없습니다')
    .optional()
    .or(z.literal('')),

  timeline: z
    .string()
    .max(200, '일정 정보는 200자를 초과할 수 없습니다')
    .optional()
    .or(z.literal('')),

  contact: ContactInfoSchema,
  metadata: ConsultationMetadataSchema,
});

// 통합 상담 요청 스키마
export const ConsultationRequestSchema = z.discriminatedUnion('type', [
  GuidedConsultationSchema,
  FreeConsultationSchema,
]);

// 상담 상태 업데이트 스키마
export const StatusUpdateSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'contacted', 'completed', 'cancelled'], {
    errorMap: () => ({ message: '유효한 상태를 선택해주세요' }),
  }),

  notes: z
    .string()
    .max(1000, '메모는 1000자를 초과할 수 없습니다')
    .optional()
    .or(z.literal('')),

  priority: z
    .enum(['low', 'normal', 'high', 'urgent'])
    .optional(),
});

// 상담 조회 쿼리 스키마
export const ConsultationQuerySchema = z.object({
  status: z
    .enum(['pending', 'reviewing', 'contacted', 'completed', 'cancelled'])
    .optional(),

  type: z
    .enum(['guided', 'free'])
    .optional(),

  priority: z
    .enum(['low', 'normal', 'high', 'urgent'])
    .optional(),

  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)')
    .optional(),

  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다 (YYYY-MM-DD)')
    .optional(),

  page: z
    .number()
    .int()
    .min(1, '페이지 번호는 1 이상이어야 합니다')
    .max(1000, '페이지 번호는 1000을 초과할 수 없습니다')
    .default(1),

  limit: z
    .number()
    .int()
    .min(1, '한 페이지당 항목 수는 1 이상이어야 합니다')
    .max(100, '한 페이지당 항목 수는 100을 초과할 수 없습니다')
    .default(20),

  search: z
    .string()
    .max(100, '검색어는 100자를 초과할 수 없습니다')
    .optional(),
}).refine((data) => {
  // 날짜 범위 검증
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: '시작 날짜는 종료 날짜보다 이전이어야 합니다',
  path: ['dateFrom'],
});

// 통계 조회 쿼리 스키마
export const StatsQuerySchema = z.object({
  period: z
    .enum(['today', 'week', 'month', 'quarter', 'year'])
    .default('month'),

  dateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),

  dateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),

  groupBy: z
    .enum(['day', 'week', 'month'])
    .default('day'),
}).refine((data) => {
  if (data.dateFrom && data.dateTo) {
    const start = new Date(data.dateFrom);
    const end = new Date(data.dateTo);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    // 최대 1년 범위로 제한
    return diffDays <= 365;
  }
  return true;
}, {
  message: '조회 기간은 최대 1년까지 가능합니다',
  path: ['dateFrom'],
});

// 파일 업로드 스키마 (향후 사용)
export const FileUploadSchema = z.object({
  name: z.string().min(1).max(255),
  size: z.number().max(10 * 1024 * 1024), // 10MB 제한
  type: z.string().regex(/^(image|application\/pdf)/, '이미지 또는 PDF 파일만 업로드 가능합니다'),
});

// 알림 설정 스키마 (향후 사용)
export const NotificationSettingsSchema = z.object({
  email: z.boolean().default(true),
  slack: z.boolean().default(false),
  sms: z.boolean().default(false),
  webhook: z.string().url().optional(),
});

// 커스텀 검증 함수들
export function validateKoreanBusinessHours(date: Date): boolean {
  const koreaTime = new Date(date.getTime() + (9 * 60 * 60 * 1000));
  const hour = koreaTime.getHours();
  const day = koreaTime.getDay();

  // 월-금 9시-18시
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

export function validatePhoneNumber(phone: string): {
  isValid: boolean;
  formatted?: string;
  type?: 'mobile' | 'landline';
} {
  const cleaned = phone.replace(/\D/g, '');

  // 한국 전화번호 패턴
  const mobilePattern = /^01[0-9]-?\d{3,4}-?\d{4}$/;
  const landlinePattern = /^0[2-9][0-9]?-?\d{3,4}-?\d{4}$/;

  if (mobilePattern.test(phone)) {
    return {
      isValid: true,
      formatted: cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      type: 'mobile',
    };
  }

  if (landlinePattern.test(phone)) {
    return {
      isValid: true,
      formatted: cleaned.length === 10
        ? cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
        : cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
      type: 'landline',
    };
  }

  return { isValid: false };
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // HTML 태그 방지
    .replace(/javascript:/gi, '') // 스크립트 인젝션 방지
    .substring(0, 10000); // 최대 길이 제한
}

// 타입 추출
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type ConsultationMetadata = z.infer<typeof ConsultationMetadataSchema>;
export type GuidedConsultationRequest = z.infer<typeof GuidedConsultationSchema>;
export type FreeConsultationRequest = z.infer<typeof FreeConsultationSchema>;
export type ConsultationRequest = z.infer<typeof ConsultationRequestSchema>;
export type StatusUpdate = z.infer<typeof StatusUpdateSchema>;
export type ConsultationQuery = z.infer<typeof ConsultationQuerySchema>;
export type StatsQuery = z.infer<typeof StatsQuerySchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;