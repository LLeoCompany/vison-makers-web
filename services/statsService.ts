/**
 * 통계 서비스
 * 캐싱이 적용된 통계 데이터 조회 서비스
 */

import { supabaseAdmin } from '@/lib/supabase';
import { caches, cacheHelpers } from '@/utils/cache';
import { logger } from '@/utils/logger';
import { formatDate } from '@/utils/consultation';

// 통계 데이터 인터페이스
export interface StatsOverview {
  totalConsultations: number;
  todayConsultations: number;
  thisWeekConsultations: number;
  thisMonthConsultations: number;
  pendingConsultations: number;
  completedConsultations: number;
  conversionRate: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface TypeBreakdown {
  guided: number;
  free: number;
  guidedPercentage: number;
  freePercentage: number;
}

export interface TrendData {
  date: string;
  total: number;
  guided: number;
  free: number;
}

export interface RecentConsultation {
  id: string;
  consultationNumber: string;
  type: string;
  status: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
}

export interface StatsData {
  overview: StatsOverview;
  statusBreakdown: StatusBreakdown[];
  typeBreakdown: TypeBreakdown;
  trends: TrendData[];
  recentConsultations: RecentConsultation[];
}

/**
 * 통계 서비스 클래스
 */
export class StatsService {
  private static instance: StatsService;

  public static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  /**
   * 전체 통계 데이터 조회 (캐싱 적용)
   */
  async getStats(
    period: string = 'month',
    dateFrom?: string,
    dateTo?: string,
    groupBy: string = 'day'
  ): Promise<StatsData> {
    const cacheKey = cacheHelpers.statsKey('full', period, { dateFrom, dateTo, groupBy });

    // 캐시에서 조회
    const cached = caches.stats.get(cacheKey);
    if (cached) {
      logger.debug('Stats cache hit', {
        action: 'cache_hit',
        metadata: { cacheKey, period },
      });
      return cached;
    }

    // 캐시 미스 - 데이터베이스에서 조회
    logger.debug('Stats cache miss - fetching from database', {
      action: 'cache_miss',
      metadata: { cacheKey, period },
    });

    const start = Date.now();

    const [
      overview,
      statusBreakdown,
      typeBreakdown,
      trends,
      recentConsultations,
    ] = await Promise.all([
      this.getOverview(),
      this.getStatusBreakdown(),
      this.getTypeBreakdown(),
      this.getTrends(period, dateFrom, dateTo, groupBy),
      this.getRecentConsultations(),
    ]);

    const statsData: StatsData = {
      overview,
      statusBreakdown,
      typeBreakdown,
      trends,
      recentConsultations,
    };

    // 캐시에 저장 (5분)
    caches.stats.set(cacheKey, statsData, 5 * 60 * 1000);

    const duration = Date.now() - start;
    logger.performanceMetric('stats_generation', duration, {
      metadata: { period, itemsGenerated: trends.length + recentConsultations.length },
    });

    return statsData;
  }

  /**
   * 개요 통계 (캐싱 적용)
   */
  private async getOverview(): Promise<StatsOverview> {
    const cacheKey = 'overview:current';
    const cached = caches.stats.get(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const queries = [
      // 전체 상담 수
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true }),

      // 오늘 상담 수
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`),

      // 이번 주 상담 수
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${weekAgo}T00:00:00Z`),

      // 이번 달 상담 수
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${monthAgo}T00:00:00Z`),

      // 대기 중 상담 수
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // 완료 상담 수
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed'),
    ];

    const results = await Promise.all(queries);

    const [
      { count: totalConsultations },
      { count: todayConsultations },
      { count: thisWeekConsultations },
      { count: thisMonthConsultations },
      { count: pendingConsultations },
      { count: completedConsultations },
    ] = results;

    const conversionRate = totalConsultations && totalConsultations > 0
      ? ((completedConsultations || 0) / totalConsultations) * 100
      : 0;

    const overview: StatsOverview = {
      totalConsultations: totalConsultations || 0,
      todayConsultations: todayConsultations || 0,
      thisWeekConsultations: thisWeekConsultations || 0,
      thisMonthConsultations: thisMonthConsultations || 0,
      pendingConsultations: pendingConsultations || 0,
      completedConsultations: completedConsultations || 0,
      conversionRate: Math.round(conversionRate * 100) / 100,
    };

    // 1분 캐시
    caches.stats.set(cacheKey, overview, 60 * 1000);

    return overview;
  }

  /**
   * 상태별 분석 (캐싱 적용)
   */
  private async getStatusBreakdown(): Promise<StatusBreakdown[]> {
    const cacheKey = 'status_breakdown:current';
    const cached = caches.stats.get(cacheKey);

    if (cached) {
      return cached;
    }

    const { data: statusBreakdown } = await supabaseAdmin
      .from('consultation_status_counts')
      .select('*');

    // 2분 캐시
    caches.stats.set(cacheKey, statusBreakdown || [], 2 * 60 * 1000);

    return statusBreakdown || [];
  }

  /**
   * 타입별 분석 (캐싱 적용)
   */
  private async getTypeBreakdown(): Promise<TypeBreakdown> {
    const cacheKey = 'type_breakdown:current';
    const cached = caches.stats.get(cacheKey);

    if (cached) {
      return cached;
    }

    const [guidedResult, freeResult, totalResult] = await Promise.all([
      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'guided'),

      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'free'),

      supabaseAdmin
        .from('consultations')
        .select('*', { count: 'exact', head: true }),
    ]);

    const guidedCount = guidedResult.count || 0;
    const freeCount = freeResult.count || 0;
    const totalCount = totalResult.count || 0;

    const typeBreakdown: TypeBreakdown = {
      guided: guidedCount,
      free: freeCount,
      guidedPercentage: totalCount ? Math.round((guidedCount / totalCount) * 10000) / 100 : 0,
      freePercentage: totalCount ? Math.round((freeCount / totalCount) * 10000) / 100 : 0,
    };

    // 2분 캐시
    caches.stats.set(cacheKey, typeBreakdown, 2 * 60 * 1000);

    return typeBreakdown;
  }

  /**
   * 트렌드 데이터 (캐싱 적용)
   */
  private async getTrends(
    period: string,
    dateFrom?: string,
    dateTo?: string,
    groupBy: string = 'day'
  ): Promise<TrendData[]> {
    const cacheKey = `trends:${period}:${dateFrom || ''}:${dateTo || ''}:${groupBy}`;
    const cached = caches.stats.get(cacheKey);

    if (cached) {
      return cached;
    }

    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = now.toISOString().split('T')[0];

    let trendsQuery = supabaseAdmin
      .from('consultation_stats')
      .select('date, total_submissions, guided_submissions, free_submissions')
      .order('date', { ascending: true });

    if (dateFrom && dateTo) {
      trendsQuery = trendsQuery
        .gte('date', dateFrom)
        .lte('date', dateTo);
    } else {
      trendsQuery = trendsQuery
        .gte('date', monthAgo)
        .lte('date', today);
    }

    const { data: trendsData } = await trendsQuery;

    const trends: TrendData[] = trendsData?.map((item) => ({
      date: item.date,
      total: item.total_submissions,
      guided: item.guided_submissions,
      free: item.free_submissions,
    })) || [];

    // 5분 캐시
    caches.stats.set(cacheKey, trends, 5 * 60 * 1000);

    return trends;
  }

  /**
   * 최근 상담 목록 (캐싱 적용)
   */
  private async getRecentConsultations(): Promise<RecentConsultation[]> {
    const cacheKey = 'recent_consultations:current';
    const cached = caches.stats.get(cacheKey);

    if (cached) {
      return cached;
    }

    const { data: recentConsultations } = await supabaseAdmin
      .from('consultation_details')
      .select(`
        id,
        consultation_number,
        type,
        status,
        contact_name,
        contact_email,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const processed: RecentConsultation[] = recentConsultations?.map((consultation) => ({
      id: consultation.id,
      consultationNumber: consultation.consultation_number,
      type: consultation.type,
      status: consultation.status,
      contactName: consultation.contact_name,
      contactEmail: consultation.contact_email,
      createdAt: formatDate(consultation.created_at, 'relative'),
    })) || [];

    // 30초 캐시 (최근 데이터이므로 짧게)
    caches.stats.set(cacheKey, processed, 30 * 1000);

    return processed;
  }

  /**
   * 캐시 무효화
   */
  invalidateCache(type?: 'overview' | 'status' | 'type' | 'trends' | 'recent' | 'all'): void {
    if (!type || type === 'all') {
      cacheHelpers.invalidate.stats();
      logger.info('All stats cache invalidated');
      return;
    }

    const patterns: { [key: string]: string } = {
      overview: 'overview:*',
      status: 'status_breakdown:*',
      type: 'type_breakdown:*',
      trends: 'trends:*',
      recent: 'recent_consultations:*',
    };

    const pattern = patterns[type];
    if (pattern) {
      const keys = caches.stats.keys(pattern);
      keys.forEach(key => caches.stats.delete(key));
      logger.info(`Stats cache invalidated for type: ${type}`);
    }
  }
}

// 싱글톤 인스턴스 export
export const statsService = StatsService.getInstance();

// 편의 함수들
export const getStatsWithCache = statsService.getStats.bind(statsService);
export const invalidateStatsCache = statsService.invalidateCache.bind(statsService);