/**
 * 성능 최적화 유틸리티
 * 데이터베이스 쿼리 최적화, 응답 압축, 배치 처리 등
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from './logger';
import { caches } from './cache';

// 쿼리 최적화 옵션
export interface QueryOptimization {
  enableBatching?: boolean;
  maxBatchSize?: number;
  enableCaching?: boolean;
  cacheTime?: number;
  enablePagination?: boolean;
  defaultPageSize?: number;
}

// 배치 처리를 위한 요청 큐
interface BatchRequest {
  id: string;
  query: string;
  params: any[];
  resolve: (data: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

/**
 * 데이터베이스 쿼리 최적화 클래스
 */
export class QueryOptimizer {
  private static instance: QueryOptimizer;
  private batchQueue: BatchRequest[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 10; // 10ms 배치 지연
  private readonly MAX_BATCH_SIZE = 10;

  public static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  /**
   * 배치 쿼리 실행
   */
  async batchQuery<T>(
    query: string,
    params: any[] = [],
    options: { enableCaching?: boolean; cacheKey?: string; cacheTime?: number } = {}
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = `batch-${Date.now()}-${Math.random()}`;

      // 캐시 확인
      if (options.enableCaching && options.cacheKey) {
        const cached = caches.apiResponses.get(options.cacheKey);
        if (cached) {
          resolve(cached);
          return;
        }
      }

      const batchRequest: BatchRequest = {
        id: requestId,
        query,
        params,
        resolve: (data) => {
          // 캐시 저장
          if (options.enableCaching && options.cacheKey) {
            caches.apiResponses.set(options.cacheKey, data, options.cacheTime);
          }
          resolve(data);
        },
        reject,
        timestamp: Date.now(),
      };

      this.batchQueue.push(batchRequest);
      this.scheduleBatchExecution();
    });
  }

  /**
   * 배치 실행 스케줄링
   */
  private scheduleBatchExecution(): void {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.executeBatch();
    }, this.BATCH_DELAY);
  }

  /**
   * 배치 실행
   */
  private async executeBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const batch = this.batchQueue.splice(0, this.MAX_BATCH_SIZE);
    this.batchTimer = null;

    // 남은 요청이 있으면 다음 배치 스케줄
    if (this.batchQueue.length > 0) {
      this.scheduleBatchExecution();
    }

    const start = Date.now();

    try {
      // 배치로 실행할 수 있는 쿼리들을 그룹화
      const queryGroups = this.groupSimilarQueries(batch);

      for (const group of queryGroups) {
        if (group.length === 1) {
          // 단일 쿼리
          await this.executeSingleQuery(group[0]);
        } else {
          // 유사한 쿼리들을 하나로 결합
          await this.executeBatchedQueries(group);
        }
      }

      const duration = Date.now() - start;
      logger.performanceMetric('batch_query_execution', duration, {
        metadata: {
          batchSize: batch.length,
          queryGroups: queryGroups.length,
        }
      });

    } catch (error) {
      // 전체 배치 실패 시 개별적으로 재시도
      logger.error('Batch query execution failed, retrying individually', {
        error: {
          name: error instanceof Error ? error.name : 'UnknownError',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        action: 'batch_query_retry',
        metadata: { batchSize: batch.length },
      });

      for (const request of batch) {
        try {
          await this.executeSingleQuery(request);
        } catch (individualError) {
          request.reject(individualError);
        }
      }
    }
  }

  /**
   * 유사한 쿼리들을 그룹화
   */
  private groupSimilarQueries(batch: BatchRequest[]): BatchRequest[][] {
    const groups: { [key: string]: BatchRequest[] } = {};

    for (const request of batch) {
      // 쿼리의 기본 구조로 그룹화 (매개변수는 제외)
      const queryPattern = request.query.replace(/\$\d+/g, '?');

      if (!groups[queryPattern]) {
        groups[queryPattern] = [];
      }
      groups[queryPattern].push(request);
    }

    return Object.values(groups);
  }

  /**
   * 단일 쿼리 실행
   */
  private async executeSingleQuery(request: BatchRequest): Promise<void> {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('execute_query', {
          query: request.query,
          params: request.params,
        });

      if (error) throw error;
      request.resolve(data);
    } catch (error) {
      request.reject(error);
    }
  }

  /**
   * 배치된 쿼리들 실행
   */
  private async executeBatchedQueries(requests: BatchRequest[]): Promise<void> {
    // IN 절을 사용한 배치 쿼리로 변환 시도
    if (this.canBatchAsInQuery(requests)) {
      await this.executeBatchAsInQuery(requests);
    } else {
      // 배치할 수 없으면 개별 실행
      for (const request of requests) {
        await this.executeSingleQuery(request);
      }
    }
  }

  /**
   * IN 쿼리로 배치 가능한지 확인
   */
  private canBatchAsInQuery(requests: BatchRequest[]): boolean {
    if (requests.length < 2) return false;

    const firstQuery = requests[0].query;

    // 기본적인 SELECT 쿼리만 배치 처리
    return firstQuery.trim().toLowerCase().startsWith('select') &&
           firstQuery.includes('WHERE') &&
           requests.every(req => req.query === firstQuery);
  }

  /**
   * IN 쿼리로 배치 실행
   */
  private async executeBatchAsInQuery(requests: BatchRequest[]): Promise<void> {
    try {
      const query = requests[0].query;
      const allParams = requests.flatMap(req => req.params);

      // IN 절로 변환된 쿼리 실행
      const { data, error } = await supabaseAdmin
        .rpc('execute_batch_query', {
          query,
          param_sets: requests.map(req => req.params),
        });

      if (error) throw error;

      // 결과를 각 요청에 분배
      requests.forEach((request, index) => {
        request.resolve(data[index] || null);
      });

    } catch (error) {
      requests.forEach(request => request.reject(error));
    }
  }
}

/**
 * 응답 압축 미들웨어
 */
export function withCompression() {
  return (req: NextApiRequest, res: NextApiResponse, next?: Function) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';

    // gzip 압축 지원 확인
    if (acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
    }

    // 캐시 헤더 설정
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    }

    if (next) next();
    return true;
  };
}

/**
 * 페이지네이션 헬퍼
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
  defaultLimit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class PaginationHelper {
  static validateAndNormalize(options: PaginationOptions): Required<PaginationOptions> {
    const {
      page = 1,
      limit = options.defaultLimit || 20,
      maxLimit = 100,
      defaultLimit = 20,
    } = options;

    return {
      page: Math.max(1, page),
      limit: Math.min(maxLimit, Math.max(1, limit)),
      maxLimit,
      defaultLimit,
    };
  }

  static async executePaginatedQuery<T>(
    queryBuilder: any,
    countQuery: any,
    options: PaginationOptions
  ): Promise<PaginationResult<T>> {
    const normalized = this.validateAndNormalize(options);
    const offset = (normalized.page - 1) * normalized.limit;

    // 병렬로 데이터와 총 개수 조회
    const [dataResult, countResult] = await Promise.all([
      queryBuilder
        .range(offset, offset + normalized.limit - 1),
      countQuery
        .select('*', { count: 'exact', head: true })
    ]);

    if (dataResult.error) throw dataResult.error;
    if (countResult.error) throw countResult.error;

    const total = countResult.count || 0;
    const totalPages = Math.ceil(total / normalized.limit);

    return {
      data: dataResult.data || [],
      pagination: {
        page: normalized.page,
        limit: normalized.limit,
        total,
        totalPages,
        hasNext: normalized.page < totalPages,
        hasPrev: normalized.page > 1,
      },
    };
  }
}

/**
 * 응답 최적화 헬퍼
 */
export class ResponseOptimizer {
  /**
   * 불필요한 필드 제거
   */
  static stripUnnecessaryFields<T extends Record<string, any>>(
    data: T,
    allowedFields: string[]
  ): Partial<T> {
    const result: Partial<T> = {};

    for (const field of allowedFields) {
      if (field in data) {
        result[field as keyof T] = data[field];
      }
    }

    return result;
  }

  /**
   * 중첩된 객체 평면화
   */
  static flatten(obj: any, prefix = '', result: any = {}): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          this.flatten(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  }

  /**
   * 조건부 필드 포함
   */
  static conditionalFields<T>(
    data: T,
    conditions: { [field: string]: boolean }
  ): T {
    const result = { ...data } as any;

    for (const [field, include] of Object.entries(conditions)) {
      if (!include && field in result) {
        delete result[field];
      }
    }

    return result;
  }
}

// 싱글톤 인스턴스
export const queryOptimizer = QueryOptimizer.getInstance();

// 편의 함수들
export const optimizedQuery = queryOptimizer.batchQuery.bind(queryOptimizer);
export const paginateQuery = PaginationHelper.executePaginatedQuery.bind(PaginationHelper);

export default {
  QueryOptimizer,
  PaginationHelper,
  ResponseOptimizer,
  withCompression,
};