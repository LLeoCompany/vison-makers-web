/**
 * 통합 API 래퍼
 * 에러 처리, 로깅, 성능 모니터링을 통합 제공
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError, handleApiError, ErrorResponse } from './errors';
import { logger, generateRequestId } from './logger';
import { AuthenticatedRequest } from '@/middleware/auth';

// API 핸들러 타입 정의
export type ApiHandler<T = any> = (
  req: NextApiRequest | AuthenticatedRequest,
  res: NextApiResponse<T>
) => Promise<void> | void;

// API 설정 인터페이스
export interface ApiConfig {
  operationName?: string;
  requireAuth?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
  validation?: {
    method?: string;
    body?: any;
    query?: any;
    params?: any;
  };
  permissions?: string[];
  logRequest?: boolean;
  logResponse?: boolean;
}

// 성공 응답 인터페이스
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  requestId?: string;
  timestamp?: string;
}

// 요청 메타데이터
interface RequestMetadata {
  requestId: string;
  startTime: number;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  userId?: string;
  userRole?: string;
}

/**
 * API 래퍼 함수
 * 에러 처리, 로깅, 성능 모니터링을 자동으로 처리
 */
export function withApiWrapper<T = any>(
  handler: ApiHandler<T>,
  config: ApiConfig = {}
) {
  return async (
    req: NextApiRequest | AuthenticatedRequest,
    res: NextApiResponse<T | SuccessResponse<T> | ErrorResponse>
  ) => {
    const metadata = initializeRequestMetadata(req);

    try {
      // 1. 요청 로깅
      if (config.logRequest !== false) {
        logApiRequest(req, metadata, config);
      }

      // 2. 메서드 검증
      if (config.validation?.method && req.method !== config.validation.method) {
        throw new ApiError(
          `${config.validation.method} 메서드만 허용됩니다`,
          'METHOD_NOT_ALLOWED',
          405
        );
      }

      // 3. 핸들러 실행
      await handler(req, res);

      // 4. 성공 응답 로깅
      if (config.logResponse !== false && !res.headersSent) {
        logApiResponse(req, res.statusCode || 200, metadata, config);
      }

    } catch (error) {
      // 5. 에러 처리 및 로깅
      handleApiErrorWithLogging(error as Error, req, res, metadata, config);
    }
  };
}

/**
 * 요청 메타데이터 초기화
 */
function initializeRequestMetadata(req: NextApiRequest | AuthenticatedRequest): RequestMetadata {
  const authReq = req as AuthenticatedRequest;

  return {
    requestId: generateRequestId(),
    startTime: Date.now(),
    method: req.method || 'UNKNOWN',
    url: req.url || '',
    ip: getClientIP(req),
    userAgent: req.headers['user-agent'] || 'unknown',
    userId: authReq.user?.id,
    userRole: authReq.user?.role,
  };
}

/**
 * API 요청 로깅
 */
function logApiRequest(
  req: NextApiRequest | AuthenticatedRequest,
  metadata: RequestMetadata,
  config: ApiConfig
): void {
  logger.apiRequest(req, {
    requestId: metadata.requestId,
    action: config.operationName,
    userId: metadata.userId,
    userRole: metadata.userRole,
    metadata: {
      bodySize: JSON.stringify(req.body || {}).length,
      queryParams: Object.keys(req.query || {}).length,
      headers: {
        contentType: req.headers['content-type'],
        accept: req.headers.accept,
        authorization: req.headers.authorization ? 'present' : 'absent',
      },
    },
  });
}

/**
 * API 응답 로깅
 */
function logApiResponse(
  req: NextApiRequest | AuthenticatedRequest,
  statusCode: number,
  metadata: RequestMetadata,
  config: ApiConfig
): void {
  const duration = Date.now() - metadata.startTime;

  logger.apiResponse(req, statusCode, duration, {
    requestId: metadata.requestId,
    action: config.operationName,
    userId: metadata.userId,
    userRole: metadata.userRole,
  });

  // 성능 메트릭 로깅 (느린 요청 감지)
  if (duration > 1000) { // 1초 이상
    logger.warn('Slow API Response', {
      requestId: metadata.requestId,
      action: config.operationName,
      duration,
      method: metadata.method,
      url: metadata.url,
      statusCode,
    });
  }
}

/**
 * 에러 처리 및 로깅
 */
function handleApiErrorWithLogging(
  error: Error,
  req: NextApiRequest | AuthenticatedRequest,
  res: NextApiResponse<ErrorResponse>,
  metadata: RequestMetadata,
  config: ApiConfig
): void {
  const duration = Date.now() - metadata.startTime;

  // 에러 로깅
  logger.apiError(error, req, {
    requestId: metadata.requestId,
    action: config.operationName,
    duration,
    userId: metadata.userId,
    userRole: metadata.userRole,
  });

  // 보안 관련 에러는 별도 로깅
  if (isSecurityRelatedError(error)) {
    logger.securityEvent(
      `Security error: ${error.message}`,
      'medium',
      req,
      {
        requestId: metadata.requestId,
        userId: metadata.userId,
      }
    );
  }

  // 에러 응답 전송
  handleApiError(error, res, metadata.requestId);
}

/**
 * 보안 관련 에러 확인
 */
function isSecurityRelatedError(error: Error): boolean {
  if (!(error instanceof ApiError)) return false;

  const securityCodes = [
    'AUTHENTICATION_REQUIRED',
    'INVALID_TOKEN',
    'INSUFFICIENT_PRIVILEGES',
    'INVALID_CREDENTIALS',
    'RATE_LIMIT_EXCEEDED',
  ];

  return securityCodes.includes(error.code);
}

/**
 * 클라이언트 IP 추출
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';
  return ip;
}

/**
 * 성공 응답 포맷터
 */
export function createSuccessResponse<T>(
  data: T,
  requestId?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    requestId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 특정 HTTP 메서드만 허용하는 래퍼
 */
export function withMethod(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  handler: ApiHandler,
  config: ApiConfig = {}
) {
  return withApiWrapper(handler, {
    ...config,
    validation: {
      ...config.validation,
      method,
    },
  });
}

/**
 * GET 메서드 전용 래퍼
 */
export function withGet<T = any>(handler: ApiHandler<T>, config: ApiConfig = {}) {
  return withMethod('GET', handler, config);
}

/**
 * POST 메서드 전용 래퍼
 */
export function withPost<T = any>(handler: ApiHandler<T>, config: ApiConfig = {}) {
  return withMethod('POST', handler, config);
}

/**
 * PUT 메서드 전용 래퍼
 */
export function withPut<T = any>(handler: ApiHandler<T>, config: ApiConfig = {}) {
  return withMethod('PUT', handler, config);
}

/**
 * DELETE 메서드 전용 래퍼
 */
export function withDelete<T = any>(handler: ApiHandler<T>, config: ApiConfig = {}) {
  return withMethod('DELETE', handler, config);
}

/**
 * 성능 모니터링 래퍼
 */
export function withPerformanceMonitoring<T = any>(
  handler: ApiHandler<T>,
  thresholds: {
    slow?: number; // 느린 요청 임계값 (ms)
    critical?: number; // 심각한 지연 임계값 (ms)
  } = {}
) {
  return withApiWrapper(async (req, res) => {
    const start = Date.now();

    try {
      await handler(req, res);
    } finally {
      const duration = Date.now() - start;
      const slowThreshold = thresholds.slow || 1000;
      const criticalThreshold = thresholds.critical || 5000;

      if (duration > criticalThreshold) {
        logger.error('Critical API Performance', {
          duration,
          method: req.method,
          url: req.url,
          metadata: { threshold: criticalThreshold },
        });
      } else if (duration > slowThreshold) {
        logger.warn('Slow API Performance', {
          duration,
          method: req.method,
          url: req.url,
          metadata: { threshold: slowThreshold },
        });
      }
    }
  });
}

/**
 * 헬스체크 전용 간단한 래퍼
 */
export function withHealthCheck(handler: ApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      res.status(503).json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: '서비스를 이용할 수 없습니다',
          timestamp: new Date().toISOString(),
        },
      });
    }
  };
}