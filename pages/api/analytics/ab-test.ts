/**
 * A/B 테스트 분석 데이터 수집 API
 * 노출, 전환, 이벤트 데이터 저장
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { getClientIP } from '@/utils/consultation';

interface ABTestAnalyticsData {
  type: 'exposure' | 'conversion' | 'event';
  testName: string;
  variant: string;
  userId: string;
  sessionId: string;
  timestamp: string;
  userSegment?: string;
  conversionType?: string;
  value?: number;
  eventName?: string;
  properties?: Record<string, any>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const data: ABTestAnalyticsData = req.body;

    // 기본 검증
    if (!data.testName || !data.variant || !data.type) {
      return res.status(400).json({
        success: false,
        message: '필수 필드가 누락되었습니다.'
      });
    }

    // 메타데이터 수집
    const metadata = {
      ip_address: getClientIP(req),
      user_agent: req.headers['user-agent'] || '',
      referrer: req.headers.referer || '',
      timestamp: new Date().toISOString()
    };

    // 분석 이벤트 저장
    await saveAnalyticsEvent(data, metadata);

    // A/B 테스트 특화 저장
    if (data.type === 'exposure' || data.type === 'conversion') {
      await saveABTestData(data, metadata);
    }

    return res.status(200).json({
      success: true,
      message: 'A/B 테스트 데이터가 저장되었습니다.'
    });

  } catch (error) {
    console.error('A/B test analytics error:', error);

    return res.status(500).json({
      success: false,
      message: '데이터 저장 중 오류가 발생했습니다.'
    });
  }
}

// 일반 분석 이벤트 저장
async function saveAnalyticsEvent(
  data: ABTestAnalyticsData,
  metadata: any
) {
  const eventData = {
    event_name: `ab_test_${data.type}`,
    user_id: data.userId,
    session_id: data.sessionId,
    properties: {
      test_name: data.testName,
      variant: data.variant,
      user_segment: data.userSegment,
      conversion_type: data.conversionType,
      value: data.value,
      event_name: data.eventName,
      custom_properties: data.properties
    },
    ...metadata
  };

  const { error } = await supabaseAdmin
    .from('analytics_events')
    .insert(eventData);

  if (error) {
    console.error('Failed to save analytics event:', error);
    throw error;
  }
}

// A/B 테스트 전용 데이터 저장
async function saveABTestData(
  data: ABTestAnalyticsData,
  metadata: any
) {
  // A/B 테스트 참여자 기록
  await upsertABTestParticipant(data, metadata);

  // 전환 이벤트인 경우 별도 저장
  if (data.type === 'conversion') {
    await saveABTestConversion(data, metadata);
  }
}

// A/B 테스트 참여자 정보 저장/업데이트
async function upsertABTestParticipant(
  data: ABTestAnalyticsData,
  metadata: any
) {
  const participantData = {
    test_name: data.testName,
    user_id: data.userId,
    session_id: data.sessionId,
    variant: data.variant,
    user_segment: data.userSegment,
    first_exposure_at: data.timestamp,
    ip_address: metadata.ip_address,
    user_agent: metadata.user_agent,
    referrer: metadata.referrer
  };

  // 기존 참여자 확인
  const { data: existingParticipant } = await supabaseAdmin
    .from('ab_test_participants')
    .select('id, first_exposure_at')
    .eq('test_name', data.testName)
    .eq('user_id', data.userId)
    .single();

  if (existingParticipant) {
    // 기존 참여자 업데이트 (마지막 활동 시간만)
    const { error } = await supabaseAdmin
      .from('ab_test_participants')
      .update({
        last_activity_at: data.timestamp,
        session_count: supabaseAdmin.sql`session_count + 1`
      })
      .eq('id', existingParticipant.id);

    if (error) {
      console.error('Failed to update A/B test participant:', error);
    }
  } else {
    // 신규 참여자 등록
    const { error } = await supabaseAdmin
      .from('ab_test_participants')
      .insert({
        ...participantData,
        last_activity_at: data.timestamp,
        session_count: 1
      });

    if (error) {
      console.error('Failed to insert A/B test participant:', error);
    }
  }
}

// A/B 테스트 전환 데이터 저장
async function saveABTestConversion(
  data: ABTestAnalyticsData,
  metadata: any
) {
  const conversionData = {
    test_name: data.testName,
    user_id: data.userId,
    session_id: data.sessionId,
    variant: data.variant,
    conversion_type: data.conversionType || 'default',
    conversion_value: data.value || 1,
    converted_at: data.timestamp,
    user_segment: data.userSegment,
    properties: data.properties,
    ip_address: metadata.ip_address,
    user_agent: metadata.user_agent
  };

  const { error } = await supabaseAdmin
    .from('ab_test_conversions')
    .insert(conversionData);

  if (error) {
    console.error('Failed to save A/B test conversion:', error);
    throw error;
  }

  // 참여자 전환 상태 업데이트
  await supabaseAdmin
    .from('ab_test_participants')
    .update({
      has_converted: true,
      first_conversion_at: data.timestamp,
      conversion_count: supabaseAdmin.sql`COALESCE(conversion_count, 0) + 1`
    })
    .eq('test_name', data.testName)
    .eq('user_id', data.userId);
}