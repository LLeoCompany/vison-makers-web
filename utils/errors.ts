/**
 * 커스텀 에러 클래스 및 에러 처리 유틸리티
 * VisionMakers API 에러 관리 시스템
 */

import { NextApiResponse } from 'next';
import { ZodError } from 'zod';

// 에러 코드 상수 정의
export const ERROR_CODES = {
  // 인증/인가 관련
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  INSUFFICIENT_PRIVILEGES: 'INSUFFICIENT_PRIVILEGES',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',

  // 요청 관련
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // 리소스 관련
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',

  // 데이터베이스 관련
  DATABASE_ERROR: 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',

  // 외부 서비스 관련
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  SMS_SEND_FAILED: 'SMS_SEND_FAILED',

  // 시스템 관련
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',

  // 비즈니스 로직 관련
  DUPLICATE_CONSULTATION: 'DUPLICATE_CONSULTATION',
  INVALID_CONSULTATION_STATUS: 'INVALID_CONSULTATION_STATUS',
  CONSULTATION_NOT_EDITABLE: 'CONSULTATION_NOT_EDITABLE',
} as const;

// 에러 코드 타입
export type ErrorCode = keyof typeof ERROR_CODES;

// 커스텀 에러 클래스
export class ApiError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Error 클래스 상속 시 필요
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  // JSON 직렬화를 위한 메서드
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

// 특정 에러 타입들
export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = '인증이 필요합니다') {
    super(message, 'AUTHENTICATION_REQUIRED', 401);
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = '권한이 부족합니다') {
    super(message, 'INSUFFICIENT_PRIVILEGES', 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = '리소스를 찾을 수 없습니다') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = '리소스 충돌이 발생했습니다') {
    super(message, 'RESOURCE_CONFLICT', 409);
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = '요청 제한을 초과했습니다') {
    super(message, 'RATE_LIMIT_EXCEEDED', 429);
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string = '데이터베이스 오류가 발생했습니다', details?: any) {
    super(message, 'DATABASE_ERROR', 500, details);
  }
}

export class ExternalServiceError extends ApiError {
  constructor(message: string = '외부 서비스 오류가 발생했습니다', details?: any) {
    super(message, 'EXTERNAL_SERVICE_ERROR', 502, details);
  }
}

// 에러 응답 인터페이스
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId?: string;
  };
}

// 에러를 API 응답으로 변환
export function formatErrorResponse(
  error: Error | ApiError,
  requestId?: string
): { statusCode: number; response: ErrorResponse } {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      response: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          timestamp: error.timestamp,
          requestId,
        },
      },
    };
  }

  // Zod 검증 에러 처리
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      response: {
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: '입력 데이터 검증에 실패했습니다',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code,
          })),
          timestamp: new Date().toISOString(),
          requestId,
        },
      },
    };
  }

  // 예상하지 못한 에러
  return {
    statusCode: 500,
    response: {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: process.env.NODE_ENV === 'production'
          ? '서버 내부 오류가 발생했습니다'
          : error.message || '알 수 없는 오류가 발생했습니다',
        details: process.env.NODE_ENV === 'production' ? undefined : {
          name: error.name,
          stack: error.stack,
        },
        timestamp: new Date().toISOString(),
        requestId,
      },
    },
  };
}

// 전역 에러 핸들러
export function handleApiError(
  error: Error | ApiError,
  res: NextApiResponse,
  requestId?: string
): void {
  const { statusCode, response } = formatErrorResponse(error, requestId);

  // 에러 로깅 (실제로는 logger 사용)
  console.error('API Error:', {
    error: error instanceof ApiError ? error.toJSON() : {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    requestId,
    timestamp: new Date().toISOString(),
  });

  // 응답 전송
  if (!res.headersSent) {
    res.status(statusCode).json(response);
  }
}

// HOC로 에러 처리를 래핑하는 헬퍼
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R> | R
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args);
    } catch (error) {
      // 에러를 다시 던져서 상위 핸들러에서 처리하도록 함
      if (error instanceof ApiError) {
        throw error;
      }

      // 예상하지 못한 에러를 ApiError로 감싸서 던짐
      throw new ApiError(
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다',
        'INTERNAL_ERROR',
        500,
        process.env.NODE_ENV === 'production' ? undefined : {
          originalError: error instanceof Error ? error.name : typeof error,
          stack: error instanceof Error ? error.stack : undefined,
        }
      );
    }
  };
}

// 비동기 함수의 에러를 안전하게 처리하는 헬퍼
export function safeAsync<T>(
  promise: Promise<T>
): Promise<[Error | null, T | null]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[Error, null]>((error: Error) => [error, null]);
}

// 특정 에러 타입인지 확인하는 타입 가드
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isAuthorizationError(error: unknown): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

// 에러 메시지 한글화 매핑
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTHENTICATION_REQUIRED]: '인증이 필요합니다',
  [ERROR_CODES.INVALID_TOKEN]: '유효하지 않은 토큰입니다',
  [ERROR_CODES.TOKEN_EXPIRED]: '토큰이 만료되었습니다',
  [ERROR_CODES.INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다',
  [ERROR_CODES.INSUFFICIENT_PRIVILEGES]: '권한이 부족합니다',
  [ERROR_CODES.ACCOUNT_DISABLED]: '비활성화된 계정입니다',
  [ERROR_CODES.VALIDATION_ERROR]: '입력 데이터가 올바르지 않습니다',
  [ERROR_CODES.METHOD_NOT_ALLOWED]: '허용되지 않는 HTTP 메서드입니다',
  [ERROR_CODES.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: '요청 제한을 초과했습니다',
  [ERROR_CODES.DATABASE_ERROR]: '데이터베이스 오류가 발생했습니다',
  [ERROR_CODES.INTERNAL_ERROR]: '서버 내부 오류가 발생했습니다',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: '서비스를 일시적으로 이용할 수 없습니다',
  [ERROR_CODES.EMAIL_SEND_FAILED]: '이메일 전송에 실패했습니다',
  [ERROR_CODES.DUPLICATE_CONSULTATION]: '이미 존재하는 상담 신청입니다',
  [ERROR_CODES.INVALID_CONSULTATION_STATUS]: '올바르지 않은 상담 상태입니다',
  [ERROR_CODES.CONSULTATION_NOT_EDITABLE]: '수정할 수 없는 상담입니다',
};

// 에러 코드로 한글 메시지 가져오기
export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || '알 수 없는 오류가 발생했습니다';
}