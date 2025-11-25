/**
 * API 버전 정보 조회 엔드포인트
 * GET /api/versions
 *
 * 현재 지원되는 API 버전들과 상세 정보를 반환합니다.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getApiVersionsInfo, extractApiVersion, ResponseTransformer } from '@/utils/apiVersioning';
import { createSuccessResponse } from '@/utils/apiWrapper';
import { withPublicApi } from '@/utils/combinedMiddleware';

interface VersionsResponse {
  success: true;
  data: {
    current: string;
    supported: string[];
    deprecated: string[];
    latest: string;
    versions: Record<string, any>;
  };
}

async function versionsHandler(
  req: NextApiRequest,
  res: NextApiResponse<VersionsResponse>
) {
  // 버전 정보 조회
  const versionInfo = getApiVersionsInfo();

  // API 버전에 따른 응답 변환
  const apiVersion = extractApiVersion(req);
  const versionedResponse = ResponseTransformer.transform(
    createSuccessResponse(versionInfo),
    apiVersion
  );

  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5분 캐시
  return res.status(200).json(versionedResponse);
}

// 공개 API로 설정 (인증 불필요)
export default withPublicApi(versionsHandler, {
  rateLimit: {
    windowMs: 60 * 1000, // 1분
    maxRequests: 30, // 분당 30회
  },
});