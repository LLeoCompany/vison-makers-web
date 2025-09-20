/**
 * 상담시스템 유틸리티 함수들
 * VisionMakers 상담시스템용
 */

/**
 * 상담 번호 생성 함수
 * 형식: CS-YYYYMMDD-XXXX
 * 예시: CS-20240917-0001
 */
export function generateConsultationNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`;

  // 랜덤 4자리 숫자 (실제로는 DB에서 시퀀스 사용)
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');

  return `CS-${dateString}-${sequence}`;
}

/**
 * IP 주소 추출 함수
 */
export function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? (typeof forwarded === 'string' ? forwarded.split(',')[0] : forwarded[0])
    : req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';

  return ip.replace('::ffff:', ''); // IPv4 mapped IPv6 주소 정리
}

/**
 * User Agent 파싱 함수
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
} {
  const ua = userAgent.toLowerCase();

  // 브라우저 감지
  let browser = 'unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // OS 감지
  let os = 'unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios')) os = 'iOS';

  // 디바이스 감지
  let device = 'desktop';
  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua);
  if (isMobile) {
    device = ua.includes('tablet') || ua.includes('ipad') ? 'tablet' : 'mobile';
  }

  return { browser, os, device, isMobile };
}

/**
 * UTM 파라미터 추출 함수
 */
export function extractUTMParams(url: string): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
} {
  if (!url) return {};

  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined,
    };
  } catch {
    return {};
  }
}

/**
 * 이메일 마스킹 함수 (프라이버시 보호)
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;

  const maskedLocal = local.length > 2
    ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    : local;

  return `${maskedLocal}@${domain}`;
}

/**
 * 전화번호 마스킹 함수 (프라이버시 보호)
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;

  const masked = cleaned.slice(0, 3) + '*'.repeat(cleaned.length - 6) + cleaned.slice(-3);

  // 기존 포맷 유지
  return phone.replace(/\d/g, (match, index) => {
    const cleanedIndex = phone.slice(0, index + 1).replace(/\D/g, '').length - 1;
    return masked[cleanedIndex] || match;
  });
}

/**
 * 상담 유형별 예상 소요시간 계산
 */
export function getEstimatedProcessingTime(type: 'guided' | 'free'): string {
  const businessHours = getBusinessHours();

  if (type === 'guided') {
    // 가이드 트랙은 더 빠른 처리
    return businessHours ? '2-4시간 내' : '다음 영업일 오전';
  } else {
    // 자유 트랙은 더 신중한 검토 필요
    return businessHours ? '4-8시간 내' : '1-2 영업일 내';
  }
}

/**
 * 현재 영업시간 확인
 */
export function getBusinessHours(): boolean {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
  const hour = koreaTime.getHours();
  const day = koreaTime.getDay();

  // 월-금 9시-18시
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

/**
 * 상담 상태별 한글 라벨
 */
export function getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    pending: '접수대기',
    reviewing: '검토중',
    contacted: '연락완료',
    completed: '상담완료',
    cancelled: '취소됨',
  };

  return labels[status] || status;
}

/**
 * 상담 우선순위별 한글 라벨
 */
export function getPriorityLabel(priority: string): string {
  const labels: { [key: string]: string } = {
    low: '낮음',
    normal: '보통',
    high: '높음',
    urgent: '긴급',
  };

  return labels[priority] || priority;
}

/**
 * 상담 유형별 한글 라벨
 */
export function getTypeLabel(type: string): string {
  const labels: { [key: string]: string } = {
    guided: '가이드 상담',
    free: '자유 상담',
  };

  return labels[type] || type;
}

/**
 * 서비스 타입별 한글 라벨
 */
export function getServiceTypeLabel(serviceType: string): string {
  const labels: { [key: string]: string } = {
    web_development: '웹사이트 개발',
    mobile_app: '모바일 앱 개발',
    desktop_app: '데스크탑 앱 개발',
    ai_ml: 'AI/머신러닝',
    blockchain: '블록체인',
    iot: 'IoT 시스템',
    consulting: 'IT 컨설팅',
    maintenance: '시스템 유지보수',
    other: '기타',
  };

  return labels[serviceType] || serviceType;
}

/**
 * 예산 범위별 한글 라벨
 */
export function getBudgetLabel(budget: string): string {
  const labels: { [key: string]: string } = {
    'under_1000': '100만원 미만',
    '1000_to_3000': '100-300만원',
    '3000_to_5000': '300-500만원',
    '5000_to_10000': '500-1000만원',
    'over_10000': '1000만원 이상',
    'negotiable': '상담 후 결정',
  };

  return labels[budget] || budget;
}

/**
 * 프로젝트 규모별 한글 라벨
 */
export function getProjectSizeLabel(size: string): string {
  const labels: { [key: string]: string } = {
    small: '소규모',
    medium: '중간규모',
    large: '대규모',
  };

  return labels[size] || size;
}

/**
 * 일정별 한글 라벨
 */
export function getTimelineLabel(timeline: string): string {
  const labels: { [key: string]: string } = {
    'asap': '최대한 빨리',
    '1_month': '1개월 내',
    '1_3_months': '1-3개월 내',
    '3_6_months': '3-6개월 내',
    '6_12_months': '6-12개월 내',
    'over_1_year': '1년 이상',
    'flexible': '유연하게',
  };

  return labels[timeline] || timeline;
}

/**
 * 중요 기능별 한글 라벨
 */
export function getFeatureLabel(feature: string): string {
  const labels: { [key: string]: string } = {
    mobile: '모바일 최적화',
    seo: '검색엔진 최적화',
    admin: '관리자 시스템',
    payment: '결제 시스템',
  };

  return labels[feature] || feature;
}

/**
 * 연락 희망 시간별 한글 라벨
 */
export function getContactTimeLabel(time: string): string {
  const labels: { [key: string]: string } = {
    morning: '오전 (9시-12시)',
    afternoon: '오후 (12시-18시)',
    evening: '저녁 (18시-21시)',
    anytime: '언제든지',
  };

  return labels[time] || time;
}

/**
 * 날짜 포맷팅 함수
 */
export function formatDate(date: string | Date, format: 'full' | 'date' | 'time' | 'relative' = 'full'): string {
  const d = new Date(date);
  const now = new Date();

  switch (format) {
    case 'date':
      return d.toLocaleDateString('ko-KR');
    case 'time':
      return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    case 'relative':
      const diff = now.getTime() - d.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (minutes < 1) return '방금 전';
      if (minutes < 60) return `${minutes}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      if (days < 7) return `${days}일 전`;
      return d.toLocaleDateString('ko-KR');
    default:
      return d.toLocaleString('ko-KR');
  }
}

/**
 * 파일 크기 포맷팅
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 데이터 검증 함수들
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9\-\+\s]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 에러 메시지 한글화
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;

  const message = error?.message || error?.error?.message || '알 수 없는 오류가 발생했습니다.';

  // 공통 에러 메시지 한글화
  const errorMap: { [key: string]: string } = {
    'Network Error': '네트워크 연결을 확인해주세요.',
    'Timeout': '요청 시간이 초과되었습니다.',
    'Unauthorized': '인증이 필요합니다.',
    'Forbidden': '접근 권한이 없습니다.',
    'Not Found': '요청한 리소스를 찾을 수 없습니다.',
    'Internal Server Error': '서버 내부 오류가 발생했습니다.',
    'Bad Request': '잘못된 요청입니다.',
  };

  return errorMap[message] || message;
}