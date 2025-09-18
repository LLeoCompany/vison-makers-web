/**
 * 레이트 리미팅 시스템
 * VisionMakers API 요청 제한 관리
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimitError } from './errors';
import { logger } from './logger';

// 레이트 리미터 설정 인터페이스
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: NextApiRequest) => string;
  onLimitReached?: (req: NextApiRequest, identifier: string) => void;
}

// 요청 기록 인터페이스
interface RequestRecord {
  count: number;
  resetTime: number;
  requests: number[]; // 요청 타임스탬프 배열
}

// 메모리 기반 레이트 리미터 클래스
export class MemoryRateLimiter {
  private records = new Map<string, RequestRecord>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 1분마다 만료된 레코드 정리
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * 레이트 리미트 체크
   */
  public check(identifier: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    totalHits: number;
  } {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // 기존 레코드 가져오기 또는 새로 생성
    let record = this.records.get(identifier);

    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + config.windowMs,
        requests: [],
      };
      this.records.set(identifier, record);
    }

    // 윈도우 내 요청만 필터링
    record.requests = record.requests.filter(timestamp => timestamp > windowStart);
    record.count = record.requests.length;

    const allowed = record.count < config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - record.count - (allowed ? 1 : 0));

    if (allowed) {
      record.requests.push(now);
      record.count++;
    }

    return {
      allowed,
      remaining,
      resetTime: record.resetTime,
      totalHits: record.count,
    };
  }

  /**
   * 특정 식별자의 레이트 리미트 초기화
   */
  public reset(identifier: string): void {
    this.records.delete(identifier);
  }

  /**
   * 모든 레이트 리미트 초기화
   */
  public resetAll(): void {
    this.records.clear();
  }

  /**
   * 만료된 레코드 정리
   */
  private cleanup(): void {
    const now = Date.now();
    const expired: string[] = [];

    for (const [identifier, record] of this.records) {
      if (now > record.resetTime) {
        expired.push(identifier);
      }
    }

    expired.forEach(identifier => this.records.delete(identifier));

    if (expired.length > 0) {
      logger.debug('Rate limiter cleanup', {
        action: 'cleanup_expired_records',
        metadata: {
          expiredCount: expired.length,
          totalRecords: this.records.size,
        },
      });
    }
  }

  /**
   * 리소스 정리
   */
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.records.clear();
  }
}

// 싱글톤 인스턴스
const rateLimiter = new MemoryRateLimiter();

/**
 * 기본 키 생성기 (IP 주소 기반)
 */
function defaultKeyGenerator(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  return `ip:${ip}`;
}

/**
 * 레이트 리미팅 미들웨어
 */
export function withRateLimit(config: RateLimitConfig) {
  return (req: NextApiRequest, res: NextApiResponse): boolean => {
    const keyGenerator = config.keyGenerator || defaultKeyGenerator;
    const identifier = keyGenerator(req);

    const result = rateLimiter.check(identifier, config);

    // 응답 헤더 설정
    res.setHeader('X-RateLimit-Limit', config.maxRequests);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

    if (!result.allowed) {
      // 제한 도달 콜백 실행
      if (config.onLimitReached) {
        config.onLimitReached(req, identifier);
      }

      // 보안 이벤트 로깅
      logger.securityEvent(
        `Rate limit exceeded for ${identifier}`,
        'medium',
        req,
        {
          identifier,
          totalHits: result.totalHits,
          limit: config.maxRequests,
          windowMs: config.windowMs,
        }
      );

      throw new RateLimitError('요청 제한을 초과했습니다. 잠시 후 다시 시도해주세요.');
    }

    return true;
  };
}

/**
 * 사용자 기반 레이트 리미팅 (인증된 사용자)
 */
export function withUserRateLimit(config: RateLimitConfig) {
  const userKeyGenerator = (req: NextApiRequest): string => {
    const authReq = req as any;
    const userId = authReq.user?.id;

    if (userId) {
      return `user:${userId}`;
    }

    // 인증되지 않은 사용자는 IP 기반
    return defaultKeyGenerator(req);
  };

  return withRateLimit({
    ...config,
    keyGenerator: userKeyGenerator,
  });
}

/**
 * 엔드포인트별 레이트 리미팅
 */
export function withEndpointRateLimit(config: RateLimitConfig) {
  const endpointKeyGenerator = (req: NextApiRequest): string => {
    const baseKey = config.keyGenerator ? config.keyGenerator(req) : defaultKeyGenerator(req);
    return `${baseKey}:${req.method}:${req.url}`;
  };

  return withRateLimit({
    ...config,
    keyGenerator: endpointKeyGenerator,
  });
}

/**
 * 미리 정의된 레이트 리미팅 설정
 */
export const rateLimitConfigs = {
  // 상담 신청 API (엄격한 제한)
  consultationSubmit: {
    maxRequests: 3, // 3회
    windowMs: 10 * 60 * 1000, // 10분
    onLimitReached: (req: NextApiRequest, identifier: string) => {
      logger.warn('Consultation submission rate limit exceeded', {
        identifier,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
      });
    },
  },

  // 상담 상태 조회 (완화된 제한)
  consultationStatus: {
    maxRequests: 20, // 20회
    windowMs: 60 * 1000, // 1분
  },

  // 관리자 API (중간 제한)
  adminApi: {
    maxRequests: 100, // 100회
    windowMs: 60 * 1000, // 1분
  },

  // 통계 API (중간 제한)
  statsApi: {
    maxRequests: 30, // 30회
    windowMs: 60 * 1000, // 1분
  },

  // 인증 API (보안 중요)
  authApi: {
    maxRequests: 5, // 5회
    windowMs: 15 * 60 * 1000, // 15분
    onLimitReached: (req: NextApiRequest, identifier: string) => {
      logger.securityEvent(
        `Auth API rate limit exceeded for ${identifier}`,
        'high',
        req,
        { identifier }
      );
    },
  },

  // 일반 API (관대한 제한)
  generalApi: {
    maxRequests: 60, // 60회
    windowMs: 60 * 1000, // 1분
  },
} as const;

/**
 * 슬라이딩 윈도우 레이트 리미터
 * 더 정확한 제한을 위한 고급 구현
 */
export class SlidingWindowRateLimiter {
  private windows = new Map<string, number[]>();

  public check(identifier: string, maxRequests: number, windowMs: number): {
    allowed: boolean;
    remaining: number;
  } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // 기존 윈도우 가져오기
    const window = this.windows.get(identifier) || [];

    // 윈도우 밖의 요청 제거
    const validRequests = window.filter(timestamp => timestamp > windowStart);

    const allowed = validRequests.length < maxRequests;

    if (allowed) {
      validRequests.push(now);
    }

    // 업데이트된 윈도우 저장
    this.windows.set(identifier, validRequests);

    return {
      allowed,
      remaining: Math.max(0, maxRequests - validRequests.length),
    };
  }

  public reset(identifier: string): void {
    this.windows.delete(identifier);
  }

  public cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000; // 1시간 전

    for (const [identifier, window] of this.windows) {
      const validRequests = window.filter(timestamp => timestamp > oneHourAgo);

      if (validRequests.length === 0) {
        this.windows.delete(identifier);
      } else {
        this.windows.set(identifier, validRequests);
      }
    }
  }
}

/**
 * 적응형 레이트 리미터
 * 서버 부하에 따라 제한을 조정
 */
export class AdaptiveRateLimiter {
  private baseConfig: RateLimitConfig;
  private loadFactor: number = 1.0;

  constructor(baseConfig: RateLimitConfig) {
    this.baseConfig = baseConfig;
  }

  public updateLoadFactor(cpuUsage: number, memoryUsage: number): void {
    // CPU와 메모리 사용량에 따라 로드 팩터 조정
    const avgUsage = (cpuUsage + memoryUsage) / 2;

    if (avgUsage > 80) {
      this.loadFactor = 0.5; // 제한 강화
    } else if (avgUsage > 60) {
      this.loadFactor = 0.7;
    } else {
      this.loadFactor = 1.0; // 기본 제한
    }

    logger.info('Adaptive rate limiter updated', {
      action: 'update_load_factor',
      metadata: {
        cpuUsage,
        memoryUsage,
        loadFactor: this.loadFactor,
      },
    });
  }

  public getAdjustedConfig(): RateLimitConfig {
    return {
      ...this.baseConfig,
      maxRequests: Math.floor(this.baseConfig.maxRequests * this.loadFactor),
    };
  }
}

// 프로세스 종료 시 리소스 정리
process.on('SIGTERM', () => {
  rateLimiter.destroy();
});

process.on('SIGINT', () => {
  rateLimiter.destroy();
});

export default rateLimiter;