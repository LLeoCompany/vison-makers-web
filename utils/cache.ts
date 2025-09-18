/**
 * 캐싱 시스템
 * VisionMakers API 성능 최적화용 캐시 관리
 */

import { logger } from './logger';

// 캐시 항목 인터페이스
export interface CacheItem<T = any> {
  data: T;
  expires: number;
  created: number;
  accessed: number;
  hitCount: number;
}

// 캐시 설정 인터페이스
export interface CacheConfig {
  ttl?: number; // Time to Live (밀리초)
  maxSize?: number; // 최대 항목 수
  cleanupInterval?: number; // 정리 주기 (밀리초)
}

// 캐시 통계 인터페이스
export interface CacheStats {
  totalItems: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  memoryUsage: number;
  oldestItem: number;
  newestItem: number;
}

/**
 * 메모리 기반 LRU 캐시 구현
 */
export class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private accessOrder = new Map<string, number>();
  private config: Required<CacheConfig>;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    cleanups: 0,
  };
  private cleanupTimer?: NodeJS.Timeout;
  private accessCounter = 0;

  constructor(config: CacheConfig = {}) {
    this.config = {
      ttl: config.ttl || 5 * 60 * 1000, // 기본 5분
      maxSize: config.maxSize || 1000, // 기본 1000개
      cleanupInterval: config.cleanupInterval || 2 * 60 * 1000, // 기본 2분
    };

    this.startCleanupTimer();
  }

  /**
   * 캐시에서 값 조회
   */
  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // 만료 확인
    if (Date.now() > item.expires) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    // 액세스 정보 업데이트
    item.accessed = Date.now();
    item.hitCount++;
    this.accessOrder.set(key, ++this.accessCounter);

    this.stats.hits++;
    return item.data;
  }

  /**
   * 캐시에 값 저장
   */
  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const itemTtl = ttl || this.config.ttl;

    // 기존 항목 제거 (있는 경우)
    this.delete(key);

    // 용량 확인 및 LRU 정리
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    // 새 항목 추가
    const item: CacheItem<T> = {
      data,
      expires: now + itemTtl,
      created: now,
      accessed: now,
      hitCount: 0,
    };

    this.cache.set(key, item);
    this.accessOrder.set(key, ++this.accessCounter);
  }

  /**
   * 캐시 항목 삭제
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.accessOrder.delete(key);
    return deleted;
  }

  /**
   * 캐시 전체 삭제
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.accessCounter = 0;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      cleanups: 0,
    };
  }

  /**
   * 키 존재 여부 확인
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // 만료된 항목은 존재하지 않는 것으로 처리
    if (Date.now() > item.expires) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 캐시 크기 반환
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 캐시 통계 반환
   */
  getStats(): CacheStats {
    const items = Array.from(this.cache.values());
    const totalHits = items.reduce((sum, item) => sum + item.hitCount, 0);
    const totalRequests = this.stats.hits + this.stats.misses;

    return {
      totalItems: this.cache.size,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
      memoryUsage: this.getMemoryUsage(),
      oldestItem: items.length > 0 ? Math.min(...items.map(item => item.created)) : 0,
      newestItem: items.length > 0 ? Math.max(...items.map(item => item.created)) : 0,
    };
  }

  /**
   * 패턴으로 키 검색
   */
  keys(pattern?: string): string[] {
    const keys = Array.from(this.cache.keys());

    if (!pattern) {
      return keys;
    }

    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return keys.filter(key => regex.test(key));
  }

  /**
   * 만료된 항목 정리
   */
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, item] of this.cache) {
      if (now > item.expires) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
    this.stats.cleanups++;

    if (expiredKeys.length > 0) {
      logger.debug('Cache cleanup completed', {
        action: 'cache_cleanup',
        metadata: {
          expiredItems: expiredKeys.length,
          remainingItems: this.cache.size,
        },
      });
    }
  }

  /**
   * LRU 항목 제거
   */
  private evictLRU(): void {
    if (this.accessOrder.size === 0) return;

    // 가장 오래된 액세스 항목 찾기
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, accessTime] of this.accessOrder) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * 대략적인 메모리 사용량 계산
   */
  private getMemoryUsage(): number {
    let totalSize = 0;

    for (const [key, item] of this.cache) {
      // 키 크기 + 데이터 크기 추정
      totalSize += key.length * 2; // 문자열은 UTF-16 (2바이트)
      totalSize += JSON.stringify(item.data).length * 2;
      totalSize += 64; // CacheItem 메타데이터 추정
    }

    return totalSize;
  }

  /**
   * 정리 타이머 시작
   */
  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * 리소스 정리
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

/**
 * 캐시 관리자 클래스
 */
export class CacheManager {
  private caches = new Map<string, MemoryCache>();
  private defaultConfig: CacheConfig;

  constructor(defaultConfig: CacheConfig = {}) {
    this.defaultConfig = defaultConfig;
  }

  /**
   * 특정 네임스페이스의 캐시 가져오기
   */
  getCache<T = any>(namespace: string, config?: CacheConfig): MemoryCache<T> {
    if (!this.caches.has(namespace)) {
      const cacheConfig = { ...this.defaultConfig, ...config };
      this.caches.set(namespace, new MemoryCache<T>(cacheConfig));
    }

    return this.caches.get(namespace)!;
  }

  /**
   * 모든 캐시 통계
   */
  getAllStats(): { [namespace: string]: CacheStats } {
    const stats: { [namespace: string]: CacheStats } = {};

    for (const [namespace, cache] of this.caches) {
      stats[namespace] = cache.getStats();
    }

    return stats;
  }

  /**
   * 특정 네임스페이스 캐시 삭제
   */
  destroyCache(namespace: string): void {
    const cache = this.caches.get(namespace);
    if (cache) {
      cache.destroy();
      this.caches.delete(namespace);
    }
  }

  /**
   * 모든 캐시 정리
   */
  destroyAll(): void {
    for (const [namespace, cache] of this.caches) {
      cache.destroy();
    }
    this.caches.clear();
  }
}

// 싱글톤 인스턴스
export const cacheManager = new CacheManager({
  ttl: 5 * 60 * 1000, // 5분
  maxSize: 500,
  cleanupInterval: 2 * 60 * 1000, // 2분
});

// 네임스페이스별 캐시 인스턴스들
export const caches = {
  // 통계 데이터 캐시 (5분)
  stats: cacheManager.getCache('stats', { ttl: 5 * 60 * 1000 }),

  // 상담 상세 정보 캐시 (1분)
  consultations: cacheManager.getCache('consultations', { ttl: 60 * 1000 }),

  // 설정 데이터 캐시 (1시간)
  config: cacheManager.getCache('config', { ttl: 60 * 60 * 1000 }),

  // 사용자 세션 캐시 (30분)
  sessions: cacheManager.getCache('sessions', { ttl: 30 * 60 * 1000 }),

  // API 응답 캐시 (짧은 시간)
  apiResponses: cacheManager.getCache('api_responses', { ttl: 30 * 1000 }),
};

/**
 * 캐시 헬퍼 함수들
 */
export const cacheHelpers = {
  /**
   * 함수 결과를 캐시하는 데코레이터
   */
  memoize: <T extends any[], R>(
    fn: (...args: T) => Promise<R> | R,
    keyGenerator: (...args: T) => string,
    cache: MemoryCache<R> = caches.apiResponses,
    ttl?: number
  ) => {
    return async (...args: T): Promise<R> => {
      const key = keyGenerator(...args);
      const cached = cache.get(key);

      if (cached !== null) {
        return cached;
      }

      const result = await fn(...args);
      cache.set(key, result, ttl);
      return result;
    };
  },

  /**
   * 통계 데이터 캐시 키 생성
   */
  statsKey: (type: string, period: string, filters?: Record<string, any>) => {
    const filterStr = filters ? JSON.stringify(filters) : '';
    return `stats:${type}:${period}:${btoa(filterStr)}`;
  },

  /**
   * 상담 캐시 키 생성
   */
  consultationKey: (id: string) => `consultation:${id}`,

  /**
   * 목록 캐시 키 생성
   */
  listKey: (type: string, page: number, limit: number, filters?: Record<string, any>) => {
    const filterStr = filters ? JSON.stringify(filters) : '';
    return `list:${type}:${page}:${limit}:${btoa(filterStr)}`;
  },

  /**
   * 캐시 무효화
   */
  invalidate: {
    consultation: (id: string) => {
      caches.consultations.delete(cacheHelpers.consultationKey(id));
      // 관련된 목록 캐시도 무효화
      const listKeys = caches.consultations.keys('list:consultations:*');
      listKeys.forEach(key => caches.consultations.delete(key));
    },

    stats: () => {
      const statsKeys = caches.stats.keys('stats:*');
      statsKeys.forEach(key => caches.stats.delete(key));
    },

    all: () => {
      Object.values(caches).forEach(cache => cache.clear());
    },
  },
};

// 프로세스 종료 시 리소스 정리
process.on('SIGTERM', () => {
  cacheManager.destroyAll();
});

process.on('SIGINT', () => {
  cacheManager.destroyAll();
});

export default cacheManager;