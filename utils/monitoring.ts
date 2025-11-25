/**
 * API 모니터링 및 성능 추적 시스템
 * VisionMakers API 성능 메트릭, 헬스 체크, 알림 시스템
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { logger } from './logger';
import { caches } from './cache';

// 성능 메트릭 인터페이스
export interface PerformanceMetric {
  timestamp: number;
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  responseSize?: number;
  userAgent?: string;
  ip?: string;
  apiVersion?: string;
}

// 에러 메트릭 인터페이스
export interface ErrorMetric {
  timestamp: number;
  endpoint: string;
  method: string;
  errorCode: string;
  errorMessage: string;
  statusCode: number;
  stack?: string;
  userAgent?: string;
  ip?: string;
  apiVersion?: string;
}

// 헬스 체크 결과 인터페이스
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    cache: {
      status: 'up' | 'down';
      hitRate: number;
      memoryUsage: number;
    };
    memory: {
      status: 'up' | 'down';
      usage: NodeJS.MemoryUsage;
      usagePercent: number;
    };
    apis: {
      [endpoint: string]: {
        status: 'up' | 'down';
        avgResponseTime: number;
        errorRate: number;
      };
    };
  };
  version: string;
  uptime: number;
}

// 알림 레벨
export type AlertLevel = 'info' | 'warning' | 'critical';

// 알림 인터페이스
export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  message: string;
  timestamp: number;
  resolved: boolean;
  metadata?: Record<string, any>;
}

/**
 * 성능 모니터링 클래스
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorMetric[] = [];
  private alerts: Alert[] = [];
  private startTime = Date.now();

  // 설정값
  private readonly MAX_METRICS = 1000; // 메모리에 보관할 최대 메트릭 수
  private readonly MAX_ERRORS = 500;
  private readonly MAX_ALERTS = 100;

  // 임계값
  private readonly SLOW_REQUEST_THRESHOLD = 2000; // 2초
  private readonly HIGH_ERROR_RATE_THRESHOLD = 0.05; // 5%
  private readonly HIGH_MEMORY_THRESHOLD = 0.8; // 80%

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 성능 메트릭 기록
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // 메모리 관리 - 오래된 메트릭 삭제
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // 성능 분석 및 알림
    this.analyzePerformance(metric);

    // 로깅
    logger.performanceMetric(metric.endpoint, metric.duration, {
      metadata: {
        method: metric.method,
        statusCode: metric.statusCode,
        memoryUsed: metric.memoryUsage.heapUsed,
        apiVersion: metric.apiVersion,
      }
    });
  }

  /**
   * 에러 메트릭 기록
   */
  recordError(error: ErrorMetric): void {
    this.errors.push(error);

    // 메모리 관리
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(-this.MAX_ERRORS);
    }

    // 에러율 분석
    this.analyzeErrorRate(error);

    // 로깅
    logger.error('API Error recorded', {
      error: {
        name: error.errorCode,
        message: error.errorMessage,
      },
      action: 'api_error',
      metadata: {
        endpoint: error.endpoint,
        method: error.method,
        statusCode: error.statusCode,
        apiVersion: error.apiVersion,
      }
    });
  }

  /**
   * 성능 분석 및 알림
   */
  private analyzePerformance(metric: PerformanceMetric): void {
    // 느린 요청 체크
    if (metric.duration > this.SLOW_REQUEST_THRESHOLD) {
      this.createAlert({
        level: 'warning',
        title: 'Slow API Response',
        message: `${metric.endpoint} took ${metric.duration}ms to respond`,
        metadata: {
          endpoint: metric.endpoint,
          duration: metric.duration,
          method: metric.method,
        }
      });
    }

    // 메모리 사용량 체크
    const memoryPercent = (metric.memoryUsage.heapUsed / metric.memoryUsage.heapTotal) * 100;
    if (memoryPercent > this.HIGH_MEMORY_THRESHOLD * 100) {
      this.createAlert({
        level: 'critical',
        title: 'High Memory Usage',
        message: `Memory usage is ${memoryPercent.toFixed(1)}%`,
        metadata: {
          memoryUsage: metric.memoryUsage,
          memoryPercent,
        }
      });
    }
  }

  /**
   * 에러율 분석
   */
  private analyzeErrorRate(error: ErrorMetric): void {
    const recentMetrics = this.getRecentMetrics(5 * 60 * 1000); // 최근 5분
    const recentErrors = this.getRecentErrors(5 * 60 * 1000);

    const errorRate = recentErrors.length / Math.max(recentMetrics.length, 1);

    if (errorRate > this.HIGH_ERROR_RATE_THRESHOLD) {
      this.createAlert({
        level: 'critical',
        title: 'High Error Rate',
        message: `Error rate is ${(errorRate * 100).toFixed(1)}% over the last 5 minutes`,
        metadata: {
          errorRate,
          totalRequests: recentMetrics.length,
          totalErrors: recentErrors.length,
          endpoint: error.endpoint,
        }
      });
    }
  }

  /**
   * 알림 생성
   */
  private createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): void {
    const newAlert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      resolved: false,
      ...alert,
    };

    this.alerts.push(newAlert);

    // 메모리 관리
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(-this.MAX_ALERTS);
    }

    // 중요한 알림은 로그로 기록
    if (newAlert.level === 'critical') {
      logger.securityEvent('critical_alert_created', 'critical', undefined, {
        metadata: {
          alertId: newAlert.id,
          title: newAlert.title,
          message: newAlert.message,
        }
      });
    }
  }

  /**
   * 헬스 체크 실행
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const now = Date.now();
    const result: HealthCheckResult = {
      status: 'healthy',
      timestamp: now,
      version: process.env.npm_package_version || '1.0.0',
      uptime: now - this.startTime,
      checks: {
        database: await this.checkDatabase(),
        cache: this.checkCache(),
        memory: this.checkMemory(),
        apis: this.checkApiHealth(),
      },
    };

    // 전체 상태 결정
    const checks = Object.values(result.checks);
    const hasDown = checks.some(check =>
      (check as any).status === 'down' ||
      Object.values(check as any).some((subCheck: any) => subCheck.status === 'down')
    );

    if (hasDown) {
      result.status = 'unhealthy';
    } else {
      const hasWarnings = this.hasRecentWarnings();
      result.status = hasWarnings ? 'degraded' : 'healthy';
    }

    return result;
  }

  /**
   * 데이터베이스 상태 체크
   */
  private async checkDatabase(): Promise<HealthCheckResult['checks']['database']> {
    try {
      const { supabaseAdmin } = await import('@/lib/supabase');
      const start = Date.now();

      const { error } = await supabaseAdmin
        .from('consultations')
        .select('id')
        .limit(1)
        .maybeSingle();

      const responseTime = Date.now() - start;

      if (error) {
        return {
          status: 'down',
          error: error.message,
          responseTime,
        };
      }

      return {
        status: 'up',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'down',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 캐시 상태 체크
   */
  private checkCache(): HealthCheckResult['checks']['cache'] {
    const stats = caches.stats.getStats();

    return {
      status: 'up',
      hitRate: stats.hitRate,
      memoryUsage: stats.memoryUsage,
    };
  }

  /**
   * 메모리 상태 체크
   */
  private checkMemory(): HealthCheckResult['checks']['memory'] {
    const usage = process.memoryUsage();
    const usagePercent = (usage.heapUsed / usage.heapTotal) * 100;

    return {
      status: usagePercent > 90 ? 'down' : 'up',
      usage,
      usagePercent,
    };
  }

  /**
   * API 상태 체크
   */
  private checkApiHealth(): HealthCheckResult['checks']['apis'] {
    const recentMetrics = this.getRecentMetrics(10 * 60 * 1000); // 최근 10분
    const recentErrors = this.getRecentErrors(10 * 60 * 1000);

    const endpointStats: { [key: string]: { durations: number[], errors: number } } = {};

    // 메트릭 집계
    recentMetrics.forEach(metric => {
      if (!endpointStats[metric.endpoint]) {
        endpointStats[metric.endpoint] = { durations: [], errors: 0 };
      }
      endpointStats[metric.endpoint].durations.push(metric.duration);
    });

    // 에러 집계
    recentErrors.forEach(error => {
      if (endpointStats[error.endpoint]) {
        endpointStats[error.endpoint].errors++;
      }
    });

    const apis: HealthCheckResult['checks']['apis'] = {};

    Object.entries(endpointStats).forEach(([endpoint, stats]) => {
      const avgResponseTime = stats.durations.length > 0
        ? stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length
        : 0;

      const errorRate = stats.errors / Math.max(stats.durations.length + stats.errors, 1);

      apis[endpoint] = {
        status: errorRate > 0.1 || avgResponseTime > 5000 ? 'down' : 'up',
        avgResponseTime,
        errorRate,
      };
    });

    return apis;
  }

  /**
   * 최근 메트릭 조회
   */
  private getRecentMetrics(timeWindowMs: number): PerformanceMetric[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.metrics.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * 최근 에러 조회
   */
  private getRecentErrors(timeWindowMs: number): ErrorMetric[] {
    const cutoff = Date.now() - timeWindowMs;
    return this.errors.filter(error => error.timestamp >= cutoff);
  }

  /**
   * 최근 경고 확인
   */
  private hasRecentWarnings(): boolean {
    const recentAlerts = this.alerts.filter(
      alert => alert.timestamp > Date.now() - 10 * 60 * 1000 && !alert.resolved
    );
    return recentAlerts.some(alert => alert.level === 'warning' || alert.level === 'critical');
  }

  /**
   * 통계 조회
   */
  getStats() {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;

    const recentMetrics = this.metrics.filter(m => m.timestamp >= last24h);
    const recentErrors = this.errors.filter(e => e.timestamp >= last24h);

    const avgResponseTime = recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
      : 0;

    const errorRate = recentMetrics.length > 0
      ? recentErrors.length / (recentMetrics.length + recentErrors.length)
      : 0;

    return {
      totalRequests: recentMetrics.length,
      totalErrors: recentErrors.length,
      avgResponseTime: Math.round(avgResponseTime),
      errorRate: Math.round(errorRate * 10000) / 100, // 퍼센트로 변환
      activeAlerts: this.alerts.filter(a => !a.resolved).length,
      uptime: now - this.startTime,
    };
  }

  /**
   * 알림 목록 조회
   */
  getAlerts(): Alert[] {
    return [...this.alerts].reverse(); // 최신순
  }

  /**
   * 알림 해결 표시
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }
}

// 싱글톤 인스턴스
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * API 성능 측정 미들웨어
 */
export function withPerformanceMonitoring() {
  return (req: NextApiRequest, res: NextApiResponse, next?: Function) => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();

    // 응답 완료 시 메트릭 기록
    const originalSend = res.send;
    const originalJson = res.json;

    const recordMetric = (responseData?: any) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const endMemory = process.memoryUsage();

      const metric: PerformanceMetric = {
        timestamp: startTime,
        endpoint: req.url || 'unknown',
        method: req.method || 'GET',
        duration,
        statusCode: res.statusCode,
        memoryUsage: endMemory,
        responseSize: responseData ? JSON.stringify(responseData).length : undefined,
        userAgent: req.headers['user-agent'],
        ip: getClientIP(req),
        apiVersion: req.headers['api-version'] as string || extractVersionFromUrl(req.url || ''),
      };

      performanceMonitor.recordMetric(metric);
    };

    // res.json 래핑
    res.json = function(body: any) {
      recordMetric(body);
      return originalJson.call(this, body);
    };

    // res.send 래핑
    res.send = function(body: any) {
      recordMetric(body);
      return originalSend.call(this, body);
    };

    if (next) next();
    return true;
  };
}

/**
 * 클라이언트 IP 추출
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  return forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';
}

/**
 * URL에서 API 버전 추출
 */
function extractVersionFromUrl(url: string): string | undefined {
  const match = url.match(/\/api\/(v\d+)\//);
  return match ? match[1] : undefined;
}

export default performanceMonitor;