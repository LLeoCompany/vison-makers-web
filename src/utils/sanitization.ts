/**
 * VisionMakers 상담 시스템 - 입력 Sanitization 유틸리티
 * XSS 공격 방지를 위한 입력값 정화
 */

// HTML 태그 제거 (서버사이드에서 사용할 기본적인 sanitization)
export const stripHtmlTags = (input: string): string => {
  return input.replace(/<[^>]*>/g, '');
};

// 특수 문자 이스케이프
export const escapeHtml = (input: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  return input.replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
};

// 기본 텍스트 입력 정화 (이름, 회사명 등)
export const sanitizeTextInput = (input: string): string => {
  if (!input) return '';

  return input
    .trim()
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .slice(0, 100); // 최대 길이 제한
};

// 이메일 입력 정화
export const sanitizeEmail = (input: string): string => {
  if (!input) return '';

  return input
    .trim()
    .toLowerCase()
    .slice(0, 254); // RFC 5321 이메일 최대 길이
};

// 전화번호 입력 정화
export const sanitizePhone = (input: string): string => {
  if (!input) return '';

  // 숫자, 하이픈, 플러스, 공백만 허용
  return input
    .replace(/[^0-9\-+\s]/g, '')
    .trim()
    .slice(0, 20);
};

// 긴 텍스트 입력 정화 (프로젝트 설명, 추가 요청사항 등)
export const sanitizeLongText = (input: string, maxLength: number = 2000): string => {
  if (!input) return '';

  return stripHtmlTags(input)
    .trim()
    .slice(0, maxLength);
};

// 연락처 정보 전체 정화
export const sanitizeContactInfo = (contact: {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
}) => {
  return {
    name: sanitizeTextInput(contact.name || ''),
    phone: sanitizePhone(contact.phone || ''),
    email: sanitizeEmail(contact.email || ''),
    company: sanitizeTextInput(contact.company || '')
  };
};

// 가이드 상담 데이터 정화
export const sanitizeGuidedConsultationData = (data: {
  serviceType?: string;
  projectSize?: string;
  budget?: string;
  timeline?: string;
  importantFeatures?: string[];
  additionalRequests?: string;
  contact: any;
}) => {
  return {
    serviceType: sanitizeTextInput(data.serviceType || ''),
    projectSize: sanitizeTextInput(data.projectSize || ''),
    budget: sanitizeTextInput(data.budget || ''),
    timeline: sanitizeTextInput(data.timeline || ''),
    importantFeatures: (data.importantFeatures || []).map(feature =>
      sanitizeTextInput(feature)
    ),
    additionalRequests: sanitizeLongText(data.additionalRequests || '', 500),
    contact: sanitizeContactInfo(data.contact)
  };
};

// 자유 상담 데이터 정화
export const sanitizeFreeConsultationData = (data: {
  projectDescription?: string;
  budget?: string;
  timeline?: string;
  contact: any;
}) => {
  return {
    projectDescription: sanitizeLongText(data.projectDescription || ''),
    budget: sanitizeTextInput(data.budget || ''),
    timeline: sanitizeTextInput(data.timeline || ''),
    contact: sanitizeContactInfo(data.contact)
  };
};

// 위험한 패턴 감지 (의심스러운 입력 감지)
export const detectSuspiciousInput = (input: string): boolean => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  return suspiciousPatterns.some(pattern => pattern.test(input));
};

// 안전한 입력 검증
export const isSafeInput = (input: string): boolean => {
  if (!input) return true;

  // 너무 긴 입력 거부
  if (input.length > 10000) return false;

  // 의심스러운 패턴 감지
  if (detectSuspiciousInput(input)) return false;

  return true;
};