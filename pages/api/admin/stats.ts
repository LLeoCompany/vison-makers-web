/**
 * 관리자 통계 조회 API
 * GET /api/admin/stats
 */

import { NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { StatsQuerySchema } from '@/schemas/consultation';
import { formatDate } from '@/utils/consultation';
import { withAdminApi, presetConfigs } from '@/utils/combinedMiddleware';
import { AuthenticatedRequest } from '@/middleware/auth';
import { caches, cacheHelpers } from '@/utils/cache';
import { createSuccessResponse } from '@/utils/apiWrapper';
import { logger } from '@/utils/logger';
import { withApiVersion, ResponseTransformer, extractApiVersion } from '@/utils/apiVersioning';

interface StatsResponse {
  success: true;
  data: {
    overview: {
      totalConsultations: number;
      todayConsultations: number;
      thisWeekConsultations: number;
      thisMonthConsultations: number;
      pendingConsultations: number;
      completedConsultations: number;
      conversionRate: number;
    };
    statusBreakdown: {
      status: string;
      count: number;
      percentage: number;
    }[];
    typeBreakdown: {
      guided: number;
      free: number;
      guidedPercentage: number;
      freePercentage: number;
    };
    trends: {
      date: string;
      total: number;
      guided: number;
      free: number;
    }[];
    recentConsultations: any[];
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

async function statsHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<StatsResponse | ErrorResponse>
) {
    // 쿼리 파라미터 검증
    const validationResult = StatsQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '쿼리 파라미터가 유효하지 않습니다.',
        },
      });
    }

    const { period, dateFrom, dateTo, groupBy } = validationResult.data;

    // 캐싱된 통계 서비스 사용
    const { statsService } = await import('@/services/statsService');
    const statsData = await statsService.getStats(period, dateFrom, dateTo, groupBy);

    // API 버전에 따른 응답 변환
    const apiVersion = extractApiVersion(req);
    const versionedResponse = ResponseTransformer.transform(
      createSuccessResponse(statsData),
      apiVersion
    );

    return res.status(200).json(versionedResponse);

}

// 관리자 API + 통계 읽기 권한 + 캐싱 + 버전 관리 적용
export default withAdminApi(statsHandler, {
  permission: 'readAccess',
  ...presetConfigs.stats,
});