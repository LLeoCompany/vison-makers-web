/**
 * 실시간 최적화 메트릭 API
 * 전환율, 이탈률, 사용자 행동 데이터 제공
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

interface RealTimeMetrics {
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: number;
  ctaClickRate: number;
  formAbandonmentRate: number;
  scrollDepth: number;
  exitIntentRate: number;
  mobileConversionRate: number;
  desktopConversionRate: number;
  hourlyTrend: Array<{
    hour: number;
    conversions: number;
    visitors: number;
    rate: number;
  }>;
  topPerformingVariants: Array<{
    testName: string;
    variant: string;
    conversionRate: number;
    sampleSize: number;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const timeframe = req.query.timeframe as string || '24h';
    const metrics = await calculateRealTimeMetrics(timeframe);

    return res.status(200).json({
      success: true,
      metrics,
      timestamp: new Date().toISOString(),
      timeframe
    });

  } catch (error) {
    console.error('Real-time metrics calculation failed:', error);

    return res.status(500).json({
      success: false,
      message: '메트릭 계산 중 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function calculateRealTimeMetrics(timeframe: string): Promise<RealTimeMetrics> {
  const timeframeHours = parseTimeframe(timeframe);
  const startTime = new Date(Date.now() - timeframeHours * 60 * 60 * 1000);

  // 병렬로 모든 메트릭 계산
  const [
    conversionData,
    sessionData,
    ctaData,
    formData,
    scrollData,
    exitIntentData,
    deviceData,
    hourlyData,
    abTestData
  ] = await Promise.all([
    getConversionMetrics(startTime),
    getSessionMetrics(startTime),
    getCtaMetrics(startTime),
    getFormMetrics(startTime),
    getScrollMetrics(startTime),
    getExitIntentMetrics(startTime),
    getDeviceMetrics(startTime),
    getHourlyTrend(startTime),
    getABTestPerformance(startTime)
  ]);

  return {
    conversionRate: conversionData.rate,
    bounceRate: sessionData.bounceRate,
    avgTimeOnPage: sessionData.avgTimeOnPage,
    ctaClickRate: ctaData.clickRate,
    formAbandonmentRate: formData.abandonmentRate,
    scrollDepth: scrollData.avgDepth,
    exitIntentRate: exitIntentData.rate,
    mobileConversionRate: deviceData.mobile.conversionRate,
    desktopConversionRate: deviceData.desktop.conversionRate,
    hourlyTrend: hourlyData,
    topPerformingVariants: abTestData
  };
}

// 전환율 메트릭
async function getConversionMetrics(startTime: Date) {
  const { data: consultations } = await supabaseAdmin
    .from('consultations')
    .select('id, created_at')
    .gte('created_at', startTime.toISOString());

  const { data: sessions } = await supabaseAdmin
    .from('analytics_sessions')
    .select('id, created_at')
    .gte('created_at', startTime.toISOString());

  const conversions = consultations?.length || 0;
  const totalSessions = sessions?.length || 0;
  const rate = totalSessions > 0 ? (conversions / totalSessions) * 100 : 0;

  return {
    conversions,
    totalSessions,
    rate: Number(rate.toFixed(2))
  };
}

// 세션 메트릭 (이탈률, 체류시간)
async function getSessionMetrics(startTime: Date) {
  const { data: sessions } = await supabaseAdmin
    .from('analytics_sessions')
    .select('duration, page_views, created_at')
    .gte('created_at', startTime.toISOString());

  if (!sessions || sessions.length === 0) {
    return { bounceRate: 0, avgTimeOnPage: 0 };
  }

  const bouncedSessions = sessions.filter(s => s.page_views <= 1).length;
  const bounceRate = (bouncedSessions / sessions.length) * 100;

  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgTimeOnPage = totalDuration / sessions.length;

  return {
    bounceRate: Number(bounceRate.toFixed(2)),
    avgTimeOnPage: Number((avgTimeOnPage / 1000).toFixed(1)) // 초 단위로 변환
  };
}

// CTA 클릭률 메트릭
async function getCtaMetrics(startTime: Date) {
  const { data: ctaClicks } = await supabaseAdmin
    .from('analytics_events')
    .select('id, created_at')
    .eq('event_name', 'cta_clicked')
    .gte('created_at', startTime.toISOString());

  const { data: pageViews } = await supabaseAdmin
    .from('analytics_events')
    .select('id, created_at')
    .eq('event_name', 'page_view')
    .gte('created_at', startTime.toISOString());

  const clicks = ctaClicks?.length || 0;
  const views = pageViews?.length || 0;
  const clickRate = views > 0 ? (clicks / views) * 100 : 0;

  return {
    clicks,
    views,
    clickRate: Number(clickRate.toFixed(2))
  };
}

// 폼 포기율 메트릭
async function getFormMetrics(startTime: Date) {
  const { data: formStarts } = await supabaseAdmin
    .from('analytics_events')
    .select('id, session_id, created_at')
    .eq('event_name', 'form_started')
    .gte('created_at', startTime.toISOString());

  const { data: formSubmissions } = await supabaseAdmin
    .from('consultations')
    .select('id, created_at')
    .gte('created_at', startTime.toISOString());

  const starts = formStarts?.length || 0;
  const completions = formSubmissions?.length || 0;
  const abandonmentRate = starts > 0 ? ((starts - completions) / starts) * 100 : 0;

  return {
    starts,
    completions,
    abandonmentRate: Number(abandonmentRate.toFixed(2))
  };
}

// 스크롤 깊이 메트릭
async function getScrollMetrics(startTime: Date) {
  const { data: scrollEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('properties, created_at')
    .eq('event_name', 'scroll_depth')
    .gte('created_at', startTime.toISOString());

  if (!scrollEvents || scrollEvents.length === 0) {
    return { avgDepth: 0 };
  }

  const depths = scrollEvents.map(event => {
    try {
      const props = typeof event.properties === 'string'
        ? JSON.parse(event.properties)
        : event.properties;
      return props.depth || 0;
    } catch {
      return 0;
    }
  });

  const avgDepth = depths.reduce((sum, depth) => sum + depth, 0) / depths.length;

  return {
    avgDepth: Number(avgDepth.toFixed(1))
  };
}

// Exit Intent 율 메트릭
async function getExitIntentMetrics(startTime: Date) {
  const { data: exitIntents } = await supabaseAdmin
    .from('analytics_events')
    .select('id, created_at')
    .eq('event_name', 'exit_intent_triggered')
    .gte('created_at', startTime.toISOString());

  const { data: sessions } = await supabaseAdmin
    .from('analytics_sessions')
    .select('id, created_at')
    .gte('created_at', startTime.toISOString());

  const exitIntentCount = exitIntents?.length || 0;
  const totalSessions = sessions?.length || 0;
  const rate = totalSessions > 0 ? (exitIntentCount / totalSessions) * 100 : 0;

  return {
    exitIntentCount,
    totalSessions,
    rate: Number(rate.toFixed(2))
  };
}

// 디바이스별 전환율 메트릭
async function getDeviceMetrics(startTime: Date) {
  // 모바일 세션 및 전환
  const { data: mobileSessions } = await supabaseAdmin
    .from('analytics_sessions')
    .select('id, created_at')
    .ilike('user_agent', '%Mobile%')
    .gte('created_at', startTime.toISOString());

  const { data: mobileConversions } = await supabaseAdmin
    .from('consultations')
    .select('id, user_agent, created_at')
    .ilike('user_agent', '%Mobile%')
    .gte('created_at', startTime.toISOString());

  // 데스크톱 세션 및 전환
  const { data: desktopSessions } = await supabaseAdmin
    .from('analytics_sessions')
    .select('id, created_at')
    .not('user_agent', 'ilike', '%Mobile%')
    .gte('created_at', startTime.toISOString());

  const { data: desktopConversions } = await supabaseAdmin
    .from('consultations')
    .select('id, user_agent, created_at')
    .not('user_agent', 'ilike', '%Mobile%')
    .gte('created_at', startTime.toISOString());

  const mobileSessionCount = mobileSessions?.length || 0;
  const mobileConversionCount = mobileConversions?.length || 0;
  const mobileConversionRate = mobileSessionCount > 0
    ? (mobileConversionCount / mobileSessionCount) * 100
    : 0;

  const desktopSessionCount = desktopSessions?.length || 0;
  const desktopConversionCount = desktopConversions?.length || 0;
  const desktopConversionRate = desktopSessionCount > 0
    ? (desktopConversionCount / desktopSessionCount) * 100
    : 0;

  return {
    mobile: {
      sessions: mobileSessionCount,
      conversions: mobileConversionCount,
      conversionRate: Number(mobileConversionRate.toFixed(2))
    },
    desktop: {
      sessions: desktopSessionCount,
      conversions: desktopConversionCount,
      conversionRate: Number(desktopConversionRate.toFixed(2))
    }
  };
}

// 시간대별 전환율 트렌드
async function getHourlyTrend(startTime: Date) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const trend = await Promise.all(
    hours.map(async (hour) => {
      const hourStart = new Date(startTime);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hour + 1, 0, 0, 0);

      const { data: conversions } = await supabaseAdmin
        .from('consultations')
        .select('id')
        .gte('created_at', hourStart.toISOString())
        .lt('created_at', hourEnd.toISOString());

      const { data: visitors } = await supabaseAdmin
        .from('analytics_sessions')
        .select('id')
        .gte('created_at', hourStart.toISOString())
        .lt('created_at', hourEnd.toISOString());

      const conversionCount = conversions?.length || 0;
      const visitorCount = visitors?.length || 0;
      const rate = visitorCount > 0 ? (conversionCount / visitorCount) * 100 : 0;

      return {
        hour,
        conversions: conversionCount,
        visitors: visitorCount,
        rate: Number(rate.toFixed(2))
      };
    })
  );

  return trend;
}

// A/B 테스트 성과 데이터
async function getABTestPerformance(startTime: Date) {
  const { data: abTestEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('properties, created_at')
    .eq('event_name', 'ab_test_conversion')
    .gte('created_at', startTime.toISOString());

  if (!abTestEvents || abTestEvents.length === 0) {
    return [];
  }

  // 테스트별 성과 집계
  const testPerformance = new Map();

  abTestEvents.forEach(event => {
    try {
      const props = typeof event.properties === 'string'
        ? JSON.parse(event.properties)
        : event.properties;

      const key = `${props.test_name}_${props.variant}`;

      if (!testPerformance.has(key)) {
        testPerformance.set(key, {
          testName: props.test_name,
          variant: props.variant,
          conversions: 0,
          exposures: 0
        });
      }

      testPerformance.get(key).conversions++;
    } catch (error) {
      console.error('Failed to parse A/B test event:', error);
    }
  });

  // 노출 수 계산
  const { data: exposureEvents } = await supabaseAdmin
    .from('analytics_events')
    .select('properties, created_at')
    .eq('event_name', 'ab_test_exposure')
    .gte('created_at', startTime.toISOString());

  exposureEvents?.forEach(event => {
    try {
      const props = typeof event.properties === 'string'
        ? JSON.parse(event.properties)
        : event.properties;

      const key = `${props.test_name}_${props.variant}`;

      if (testPerformance.has(key)) {
        testPerformance.get(key).exposures++;
      }
    } catch (error) {
      console.error('Failed to parse A/B test exposure:', error);
    }
  });

  // 전환율 계산 및 정렬
  const results = Array.from(testPerformance.values())
    .map(test => ({
      testName: test.testName,
      variant: test.variant,
      conversionRate: test.exposures > 0 ? (test.conversions / test.exposures) * 100 : 0,
      sampleSize: test.exposures
    }))
    .filter(test => test.sampleSize >= 10) // 최소 샘플 사이즈 필터
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, 5); // 상위 5개만

  return results.map(result => ({
    ...result,
    conversionRate: Number(result.conversionRate.toFixed(2))
  }));
}

// 시간 범위 파싱
function parseTimeframe(timeframe: string): number {
  switch (timeframe) {
    case '1h': return 1;
    case '6h': return 6;
    case '12h': return 12;
    case '24h': return 24;
    case '48h': return 48;
    case '7d': return 24 * 7;
    default: return 24;
  }
}