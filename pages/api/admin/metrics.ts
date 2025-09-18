/**
 * 관리자용 메트릭 조회 API
 * GET /api/admin/metrics
 *
 * 상세한 성능 메트릭과 알림 정보를 제공합니다.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticatedRequest } from '@/middleware/auth';
import { performanceMonitor } from '@/utils/monitoring';
import { extractApiVersion, ResponseTransformer } from '@/utils/apiVersioning';
import { createSuccessResponse } from '@/utils/apiWrapper';
import { withAdminApi } from '@/utils/combinedMiddleware';

interface MetricsResponse {
  success: true;
  data: {
    overview: {
      totalRequests: number;
      totalErrors: number;
      avgResponseTime: number;
      errorRate: number;
      activeAlerts: number;
      uptime: number;
    };
    alerts: Array<{
      id: string;
      level: string;
      title: string;
      message: string;
      timestamp: number;
      resolved: boolean;
      metadata?: Record<string, any>;
    }>;
    systemInfo: {
      nodeVersion: string;
      platform: string;
      arch: string;
      memory: NodeJS.MemoryUsage;
      pid: number;
    };
  };
}

async function metricsHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<MetricsResponse>
) {
  // 성능 통계 조회
  const stats = performanceMonitor.getStats();
  const alerts = performanceMonitor.getAlerts();

  // 시스템 정보
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    pid: process.pid,
  };

  const metricsData = {
    overview: stats,
    alerts: alerts.map(alert => ({
      id: alert.id,
      level: alert.level,
      title: alert.title,
      message: alert.message,
      timestamp: alert.timestamp,
      resolved: alert.resolved,
      metadata: alert.metadata,
    })),
    systemInfo,
  };

  // API 버전에 따른 응답 변환
  const apiVersion = extractApiVersion(req);
  const versionedResponse = ResponseTransformer.transform(
    createSuccessResponse(metricsData),
    apiVersion
  );

  // 짧은 캐시 (30초)
  res.setHeader('Cache-Control', 'private, max-age=30');

  return res.status(200).json(versionedResponse);
}

export default withAdminApi(metricsHandler, {
  permission: 'readAccess',
  rateLimit: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1분
  },
  apiConfig: {
    operationName: 'admin_metrics',
    logRequest: false,
    logResponse: false,
  },
});