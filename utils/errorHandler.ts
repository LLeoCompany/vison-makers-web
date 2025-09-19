/**
 * 에러 처리 유틸리티
 * API 에러, 네트워크 에러, 유효성 검사 에러 등을 일관성있게 처리
 */

// 에러 타입 정의
export interface AppError {
  code: string;
  message: string;
  details?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// 에러 코드 상수
export const ERROR_CODES = {
  // 네트워크 관련
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  CONNECTION_FAILED: 'CONNECTION_FAILED',

  // API 관련
  API_ERROR: 'API_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',

  // 유효성 검사
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',

  // 상담 시스템 관련
  CONSULTATION_ERROR: 'CONSULTATION_ERROR',
  DUPLICATE_SUBMISSION: 'DUPLICATE_SUBMISSION',
  FORM_TIMEOUT: 'FORM_TIMEOUT',

  // 알 수 없는 에러
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * API 에러를 AppError로 변환
 */
export function handleApiError(error: any): AppError {
  // 네트워크 에러
  if (!error.response) {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: '네트워크 연결을 확인해주세요.',
        severity: 'medium'
      };
    }

    if (error.code === 'TIMEOUT' || error.message.includes('timeout')) {
      return {
        code: ERROR_CODES.TIMEOUT,
        message: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
        severity: 'medium'
      };
    }

    return {
      code: ERROR_CODES.CONNECTION_FAILED,
      message: '서버 연결에 실패했습니다.',
      severity: 'high'
    };
  }

  // HTTP 상태 코드별 처리
  const status = error.response.status;
  const data = error.response.data || {};

  switch (status) {
    case 400:
      return {
        code: ERROR_CODES.BAD_REQUEST,
        message: data.message || '잘못된 요청입니다.',
        details: data.errors,
        severity: 'low'
      };

    case 401:
      return {
        code: ERROR_CODES.UNAUTHORIZED,
        message: '인증이 필요합니다.',
        severity: 'medium'
      };

    case 403:
      return {
        code: ERROR_CODES.FORBIDDEN,
        message: '접근 권한이 없습니다.',
        severity: 'medium'
      };

    case 404:
      return {
        code: ERROR_CODES.NOT_FOUND,
        message: '요청한 페이지를 찾을 수 없습니다.',
        severity: 'low'
      };

    case 422:
      return {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: data.message || '입력한 정보를 확인해주세요.',
        details: data.errors,
        severity: 'low'
      };

    case 429:
      return {
        code: ERROR_CODES.API_ERROR,
        message: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.',
        severity: 'medium'
      };

    case 500:
    case 502:
    case 503:
    case 504:
      return {
        code: ERROR_CODES.SERVER_ERROR,
        message: '서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        severity: 'high'
      };

    default:
      return {
        code: ERROR_CODES.API_ERROR,
        message: data.message || '알 수 없는 오류가 발생했습니다.',
        severity: 'medium'
      };
  }
}

/**
 * 유효성 검사 에러 처리
 */
export function handleValidationError(field: string, rule: string, value?: any): AppError {
  const messages: Record<string, string> = {
    required: `${field}은(는) 필수 입력 항목입니다.`,
    email: '올바른 이메일 주소를 입력해주세요.',
    phone: '올바른 전화번호를 입력해주세요.',
    minLength: `${field}은(는) 최소 길이를 만족해야 합니다.`,
    maxLength: `${field}이(가) 너무 깁니다.`,
    pattern: `${field} 형식이 올바르지 않습니다.`
  };

  return {
    code: ERROR_CODES.VALIDATION_ERROR,
    message: messages[rule] || `${field} 검증에 실패했습니다.`,
    details: { field, rule, value },
    severity: 'low'
  };
}

/**
 * 상담 시스템 특화 에러 처리
 */
export function handleConsultationError(error: any): AppError {
  if (error.code === 'DUPLICATE_SUBMISSION') {
    return {
      code: ERROR_CODES.DUPLICATE_SUBMISSION,
      message: '이미 상담 신청을 하셨습니다. 잠시 후 다시 시도해주세요.',
      severity: 'medium'
    };
  }

  if (error.code === 'FORM_TIMEOUT') {
    return {
      code: ERROR_CODES.FORM_TIMEOUT,
      message: '세션이 만료되었습니다. 페이지를 새로고침하고 다시 시도해주세요.',
      severity: 'medium'
    };
  }

  return {
    code: ERROR_CODES.CONSULTATION_ERROR,
    message: error.message || '상담 신청 중 오류가 발생했습니다.',
    severity: 'high'
  };
}

/**
 * 에러 로깅
 */
export function logError(error: AppError, context?: any): void {
  const logData = {
    timestamp: new Date().toISOString(),
    error,
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown'
  };

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', logData);
  }

  // 프로덕션 환경에서는 외부 로깅 서비스로 전송
  if (process.env.NODE_ENV === 'production' && error.severity === 'critical') {
    // 예: Sentry, LogRocket, DataDog 등
    // sendToExternalLogger(logData);
  }
}

/**
 * 에러를 사용자 친화적 메시지로 변환
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

/**
 * 에러 심각도별 처리 방법 결정
 */
export function getErrorAction(severity: AppError['severity']): {
  showToast: boolean;
  showModal: boolean;
  redirectToErrorPage: boolean;
  retryable: boolean;
} {
  switch (severity) {
    case 'low':
      return {
        showToast: true,
        showModal: false,
        redirectToErrorPage: false,
        retryable: true
      };

    case 'medium':
      return {
        showToast: true,
        showModal: false,
        redirectToErrorPage: false,
        retryable: true
      };

    case 'high':
      return {
        showToast: false,
        showModal: true,
        redirectToErrorPage: false,
        retryable: true
      };

    case 'critical':
      return {
        showToast: false,
        showModal: true,
        redirectToErrorPage: true,
        retryable: false
      };

    default:
      return {
        showToast: true,
        showModal: false,
        redirectToErrorPage: false,
        retryable: true
      };
  }
}