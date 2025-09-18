/**
 * 헬스 체크 API 엔드포인트
 * GET /api/health
 *
 * 시스템 상태를 확인하고 모니터링 데이터를 제공합니다.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { performanceMonitor, HealthCheckResult } from '@/utils/monitoring';
import { extractApiVersion, ResponseTransformer } from '@/utils/apiVersioning';
import { createSuccessResponse } from '@/utils/apiWrapper';
import { withPublicApi } from '@/utils/combinedMiddleware';

interface HealthResponse {
  success: true;
  data: HealthCheckResult;
}

async function healthHandler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // 헬스 체크 실행
  const healthCheck = await performanceMonitor.performHealthCheck();

  // 상태에 따른 HTTP 상태 코드 설정
  let statusCode = 200;
  if (healthCheck.status === 'degraded') {
    statusCode = 200; // 여전히 서비스 가능
  } else if (healthCheck.status === 'unhealthy') {
    statusCode = 503; // 서비스 불가능
  }

  // 캐시 헤더 설정 (짧은 캐시)
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // API 버전에 따른 응답 변환
  const apiVersion = extractApiVersion(req);
  const versionedResponse = ResponseTransformer.transform(
    createSuccessResponse(healthCheck),
    apiVersion
  );

  return res.status(statusCode).json(versionedResponse);
}

export default withPublicApi(healthHandler, {
  rateLimit: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1분
  },
  apiConfig: {
    operationName: 'health_check',
    logRequest: false,
    logResponse: false,
  },
});