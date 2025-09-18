# VisionMakers API 설계 개선 권장사항

## 🔍 현재 상태 평가

### ✅ 잘 구현된 부분
1. **데이터베이스 정규화** - 중복 최소화, 무결성 보장
2. **RESTful API 설계** - 자원 중심, 일관된 응답 구조
3. **RLS 보안** - Supabase의 강력한 보안 기능 활용
4. **입력 검증** - Zod 스키마를 통한 타입 안전성
5. **계층화 아키텍처** - Service, Repository, Utils 분리

## ⚠️ 개선이 필요한 부분

### 1. **인증/인가 시스템 강화**

**현재 문제점:**
- 관리자 API에 대한 적절한 인증 시스템 부족
- API 키 검증 로직이 구현되어 있지 않음
- JWT 토큰 기반 인증 미구현

**개선 방안:**

#### A. JWT 기반 관리자 인증 추가
```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    role: 'admin' | 'manager';
    permissions: string[];
  };
}

export function authenticateAdmin(req: AuthenticatedRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new Error('인증 토큰이 필요합니다');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== 'admin' && decoded.role !== 'manager') {
      throw new Error('관리자 권한이 필요합니다');
    }

    req.user = decoded;
    return decoded;
  } catch (error) {
    throw new Error('유효하지 않은 인증 토큰입니다');
  }
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest) => {
    if (!req.user?.permissions.includes(permission)) {
      throw new Error('충분한 권한이 없습니다');
    }
  };
}
```

#### B. API 키 검증 시스템
```typescript
// middleware/apiKey.ts
export function verifyApiKey(req: NextApiRequest) {
  const apiKey = req.headers['x-api-key'] as string;
  const validKeys = process.env.VALID_API_KEYS?.split(',') || [];

  if (!apiKey || !validKeys.includes(apiKey)) {
    throw new Error('유효하지 않은 API 키입니다');
  }
}
```

### 2. **레이트 리미팅 구현**

**현재 문제점:**
- API 남용 방지 시스템 부족
- DDoS 공격에 취약

**개선 방안:**

#### Redis 기반 레이트 리미터
```typescript
// utils/rateLimiter.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<boolean> {
  const key = `rate_limit:${identifier}`;
  const window = Math.floor(Date.now() / windowMs);
  const windowKey = `${key}:${window}`;

  const current = await redis.incr(windowKey);

  if (current === 1) {
    await redis.expire(windowKey, Math.ceil(windowMs / 1000));
  }

  return current <= maxRequests;
}

// 사용법
export function withRateLimit(
  maxRequests: number = 10,
  windowMs: number = 60000
) {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] as string;

    const allowed = await checkRateLimit(identifier, maxRequests, windowMs);

    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: '요청 제한을 초과했습니다. 잠시 후 다시 시도해주세요.',
        },
      });
    }

    next();
  };
}
```

### 3. **캐싱 전략 도입**

**현재 문제점:**
- 통계 데이터 매번 DB 조회
- 성능 최적화 부족

**개선 방안:**

#### Redis 캐싱 레이어
```typescript
// services/cache.ts
import Redis from 'ioredis';

class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 3600): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

export const cacheService = new CacheService();

// 사용 예시
export async function getCachedStats(period: string = 'today') {
  const cacheKey = `stats:${period}`;

  let stats = await cacheService.get(cacheKey);

  if (!stats) {
    stats = await calculateStats(period);
    await cacheService.set(cacheKey, stats, 300); // 5분 캐시
  }

  return stats;
}
```

### 4. **에러 처리 및 로깅 개선**

**현재 문제점:**
- 통합된 에러 처리 시스템 부족
- 구조화된 로깅 부족

**개선 방안:**

#### 통합 에러 핸들러
```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: any) {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      response: {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }

  // 예상치 못한 오류
  console.error('Unexpected error:', error);

  return {
    statusCode: 500,
    response: {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
      },
    },
  };
}

// HOC로 래핑
export function withErrorHandler(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const { statusCode, response } = handleApiError(error);
      res.status(statusCode).json(response);
    }
  };
}
```

#### 구조화된 로깅
```typescript
// utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// API 호출 로깅 미들웨어
export function withLogging(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();

    logger.info('API Request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    try {
      await handler(req, res);
    } finally {
      const duration = Date.now() - start;

      logger.info('API Response', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
      });
    }
  };
}
```

### 5. **데이터베이스 최적화**

**현재 문제점:**
- N+1 쿼리 문제 가능성
- 복잡한 조인 쿼리 성능 최적화 부족

**개선 방안:**

#### 데이터베이스 뷰 최적화
```sql
-- 성능 최적화된 상담 상세 뷰
CREATE MATERIALIZED VIEW consultation_details_optimized AS
SELECT
    c.*,
    gc.service_type,
    gc.project_size,
    gc.budget,
    gc.timeline,
    gc.important_features,
    gc.additional_requests,
    fc.project_description,
    fc.budget_range,
    fc.timeline_preference,
    -- 집계 데이터 미리 계산
    (SELECT COUNT(*) FROM consultation_logs cl WHERE cl.consultation_id = c.id) as log_count,
    (SELECT MAX(created_at) FROM consultation_logs cl WHERE cl.consultation_id = c.id) as last_activity
FROM consultations c
LEFT JOIN guided_consultations gc ON c.id = gc.consultation_id
LEFT JOIN free_consultations fc ON c.id = fc.consultation_id;

-- 인덱스 추가
CREATE INDEX idx_consultation_details_optimized_compound
ON consultation_details_optimized (status, created_at DESC, type);

-- 뷰 자동 갱신 함수
CREATE OR REPLACE FUNCTION refresh_consultation_details_optimized()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW consultation_details_optimized;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 트리거 설정 (변경사항 발생 시 뷰 갱신)
CREATE TRIGGER trigger_refresh_consultation_details
    AFTER INSERT OR UPDATE OR DELETE ON consultations
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_consultation_details_optimized();
```

### 6. **API 버전 관리**

**현재 문제점:**
- API 버전 관리 전략 부재
- 하위 호환성 고려 부족

**개선 방안:**

#### API 버전 관리 시스템
```typescript
// pages/api/v1/consultation-submit.ts
// pages/api/v2/consultation-submit.ts

// middleware/version.ts
export function withApiVersion(version: string) {
  return (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    const requestedVersion = req.headers['api-version'] || req.query.version || 'v1';

    if (requestedVersion !== version) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VERSION_MISMATCH',
          message: `API 버전 ${requestedVersion}는 지원되지 않습니다. 현재 버전: ${version}`,
          supportedVersions: ['v1', 'v2'],
        },
      });
    }

    next();
  };
}
```

### 7. **모니터링 및 알림 강화**

**개선 방안:**

#### APM 통합
```typescript
// utils/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export class MonitoringService {
  static initSentry() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    });
  }

  static trackPerformance(transaction: string, duration: number, success: boolean) {
    Sentry.addBreadcrumb({
      category: 'api.performance',
      message: `${transaction} completed in ${duration}ms`,
      level: success ? 'info' : 'error',
      data: { duration, success }
    });
  }

  static reportError(error: Error, context: any = {}) {
    Sentry.withScope((scope) => {
      scope.setContext('api_context', context);
      Sentry.captureException(error);
    });
  }
}
```

## 🚀 구현 우선순위

### 높음 (즉시 구현)
1. **인증/인가 시스템** - 보안 강화
2. **에러 처리 통합** - 안정성 향상
3. **레이트 리미팅** - 남용 방지

### 중간 (단기 구현)
4. **캐싱 시스템** - 성능 최적화
5. **로깅 시스템** - 디버깅 및 모니터링
6. **API 버전 관리** - 확장성

### 낮음 (장기 구현)
7. **데이터베이스 최적화** - 대용량 처리
8. **모니터링 강화** - 운영 효율성

## 💡 추가 권장사항

### 1. **GraphQL 도입 고려**
- REST API의 Over-fetching/Under-fetching 문제 해결
- 프론트엔드에서 필요한 데이터만 요청 가능

### 2. **서버리스 함수 활용**
- Supabase Edge Functions 또는 Vercel Functions 활용
- 특정 비즈니스 로직의 서버리스 구현

### 3. **실시간 기능 강화**
- Supabase Realtime을 활용한 실시간 상담 상태 업데이트
- WebSocket 기반 관리자 대시보드

### 4. **데이터 분석 파이프라인**
- ETL 프로세스 구축
- 비즈니스 인텔리전스 대시보드 연동

이러한 개선사항들을 단계적으로 구현하면 더욱 견고하고 확장 가능한 API 시스템을 구축할 수 있습니다.