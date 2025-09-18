/**
 * 통합 미들웨어 시스템
 * 인증, 레이트 리미팅, 로깅을 결합한 미들웨어 체인
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest, authMiddlewares } from '@/middleware/auth';
import { withRateLimit, RateLimitConfig } from '@/utils/rateLimiter';
import { withApiWrapper, ApiConfig } from '@/utils/apiWrapper';
import { withApiVersion, ApiVersion } from '@/utils/apiVersioning';
import { withPerformanceMonitoring } from '@/utils/monitoring';

// 미들웨어 실행 순서
export type MiddlewareChain = Array<(req: any, res: NextApiResponse) => boolean | Promise<boolean>>;

/**
 * 미들웨어 체인 실행기
 */
export async function runMiddlewareChain(
  req: NextApiRequest | AuthenticatedRequest,
  res: NextApiResponse,
  middlewares: MiddlewareChain
): Promise<boolean> {
  for (const middleware of middlewares) {
    const result = await middleware(req, res);
    if (!result) {
      return false; // 미들웨어에서 이미 응답을 보냈음
    }
  }
  return true;
}

/**
 * 통합 API 미들웨어 래퍼
 */
export function withCombinedMiddleware<T = any>(
  handler: (req: AuthenticatedRequest, res: NextApiResponse<T>) => Promise<void> | void,
  options: {
    auth?: keyof typeof authMiddlewares | MiddlewareChain;
    rateLimit?: RateLimitConfig;
    apiConfig?: ApiConfig;
    apiVersions?: ApiVersion[];
    enableMonitoring?: boolean;
  } = {}
) {
  // 미들웨어 체인 구성
  const middlewares: MiddlewareChain = [];

  // 1. 성능 모니터링 (가장 먼저 - 전체 요청/응답 추적)
  if (options.enableMonitoring !== false) {
    middlewares.push(withPerformanceMonitoring());
  }

  // 2. API 버전 체크
  if (options.apiVersions) {
    middlewares.push(withApiVersion(options.apiVersions));
  }

  // 3. 레이트 리미팅
  if (options.rateLimit) {
    middlewares.push(withRateLimit(options.rateLimit));
  }

  // 4. 인증/인가
  if (options.auth) {
    if (typeof options.auth === 'string') {
      middlewares.push(...authMiddlewares[options.auth]);
    } else {
      middlewares.push(...options.auth);
    }
  }

  // 3. API 래퍼 적용
  return withApiWrapper(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // 미들웨어 체인 실행
    const isValid = await runMiddlewareChain(req, res, middlewares);

    if (!isValid) {
      return; // 미들웨어에서 이미 응답을 보냈음
    }

    // 핸들러 실행
    await handler(req, res);
  }, options.apiConfig);
}

/**
 * 공개 API용 (인증 불필요, 레이트 리미팅만 적용)
 */
export function withPublicApi<T = any>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>) => Promise<void> | void,
  options: {
    rateLimit?: RateLimitConfig;
    apiConfig?: ApiConfig;
    apiVersions?: ApiVersion[];
    enableMonitoring?: boolean;
  } = {}
) {
  return withCombinedMiddleware(handler, {
    rateLimit: options.rateLimit,
    apiConfig: options.apiConfig,
    apiVersions: options.apiVersions,
    enableMonitoring: options.enableMonitoring,
  });
}

/**
 * 관리자 API용 (인증 + 레이트 리미팅)
 */
export function withAdminApi<T = any>(
  handler: (req: AuthenticatedRequest, res: NextApiResponse<T>) => Promise<void> | void,
  options: {
    permission?: 'readAccess' | 'writeAccess' | 'deleteAccess' | 'adminOnly';
    rateLimit?: RateLimitConfig;
    apiConfig?: ApiConfig;
    apiVersions?: ApiVersion[];
    enableMonitoring?: boolean;
  } = {}
) {
  const authMiddleware = options.permission
    ? authMiddlewares[options.permission]
    : authMiddlewares.readAccess;

  return withCombinedMiddleware(handler, {
    auth: authMiddleware,
    rateLimit: options.rateLimit,
    apiConfig: options.apiConfig,
    apiVersions: options.apiVersions,
    enableMonitoring: options.enableMonitoring,
  });
}

/**
 * 인증 API용 (특별한 보안 설정)
 */
export function withAuthApi<T = any>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>) => Promise<void> | void,
  options: {
    rateLimit?: RateLimitConfig;
    apiConfig?: ApiConfig;
  } = {}
) {
  return withCombinedMiddleware(handler, {
    rateLimit: options.rateLimit,
    apiConfig: {
      ...options.apiConfig,
      operationName: options.apiConfig?.operationName || 'auth_operation',
    },
  });
}

// 미리 정의된 설정들
export const presetConfigs = {
  // 상담 신청 API
  consultationSubmit: {
    rateLimit: {
      maxRequests: 3,
      windowMs: 10 * 60 * 1000, // 10분
    },
    apiConfig: {
      operationName: 'consultation_submit',
      logRequest: true,
      logResponse: true,
    },
    apiVersions: ['v1', 'v2'] as ApiVersion[],
  },

  // 상담 상태 조회
  consultationStatus: {
    rateLimit: {
      maxRequests: 20,
      windowMs: 60 * 1000, // 1분
    },
    apiConfig: {
      operationName: 'consultation_status',
      logRequest: false,
      logResponse: false,
    },
  },

  // 관리자 목록 조회
  adminList: {
    rateLimit: {
      maxRequests: 100,
      windowMs: 60 * 1000, // 1분
    },
    apiConfig: {
      operationName: 'admin_list',
      logRequest: true,
      logResponse: false,
    },
  },

  // 관리자 상세/업데이트
  adminDetail: {
    rateLimit: {
      maxRequests: 50,
      windowMs: 60 * 1000, // 1분
    },
    apiConfig: {
      operationName: 'admin_detail',
      logRequest: true,
      logResponse: true,
    },
  },

  // 통계 API
  stats: {
    rateLimit: {
      maxRequests: 30,
      windowMs: 60 * 1000, // 1분
    },
    apiConfig: {
      operationName: 'stats',
      logRequest: false,
      logResponse: false,
    },
    apiVersions: ['v1', 'v2'] as ApiVersion[],
  },

  // 인증 API
  auth: {
    rateLimit: {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 15분
    },
    apiConfig: {
      operationName: 'auth',
      logRequest: true,
      logResponse: true,
    },
  },
} as const;