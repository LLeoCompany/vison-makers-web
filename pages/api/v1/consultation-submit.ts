/**
 * 상담 신청 API v1
 * POST /api/v1/consultation-submit
 *
 * v1 형식: 기존 형태의 응답 (success 필드 없음)
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { ConsultationRequestSchema, sanitizeInput } from '@/schemas/consultation';
import { supabaseAdmin } from '@/lib/supabase';
import { generateConsultationNumber, getClientIP, parseUserAgent, extractUTMParams, getEstimatedProcessingTime } from '@/utils/consultation';
import { ConsultationRequest } from '@/types/database';
import { ValidationError, DatabaseError } from '@/utils/errors';
import { logger } from '@/utils/logger';
import { ResponseTransformer } from '@/utils/apiVersioning';
import { withPublicApi, presetConfigs } from '@/utils/combinedMiddleware';

interface V1ConsultationResponse {
  consultationId: string;
  consultationNumber: string;
  estimatedContactTime: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: ConsultationRequest;
}

async function consultationSubmitV1Handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<V1ConsultationResponse>
) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('API-Version', 'v1');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. 요청 데이터 검증
  const validationResult = ConsultationRequestSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new ValidationError('입력 데이터가 유효하지 않습니다.', validationResult.error.errors);
  }

  const consultationData = validationResult.data;

    // 2. 메타데이터 수집
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = getClientIP(req);
    const referrer = req.headers.referer || req.headers.referrer || '';
    const utmParams = extractUTMParams(referrer);

    // 3. 상담 번호 생성
    const consultationNumber = generateConsultationNumber();

    // 4. 메인 상담 레코드 생성
    const { data: consultation, error: consultationError } = await supabaseAdmin
      .from('consultations')
      .insert({
        consultation_number: consultationNumber,
        type: consultationData.type,
        status: 'pending',
        priority: 'normal',
        contact_name: sanitizeInput(consultationData.contact.name),
        contact_phone: sanitizeInput(consultationData.contact.phone),
        contact_email: sanitizeInput(consultationData.contact.email),
        contact_company: consultationData.contact.company ? sanitizeInput(consultationData.contact.company) : null,
        preferred_contact_time: consultationData.contact.preferredContactTime || null,
        user_agent: userAgent,
        ip_address: ipAddress,
        referrer_url: referrer,
        utm_source: utmParams.source || null,
        utm_medium: utmParams.medium || null,
        utm_campaign: utmParams.campaign || null,
      })
      .select()
      .single();

    if (consultationError) {
      logger.error('Consultation insert failed', {
        error: {
          name: consultationError.name || 'SupabaseError',
          message: consultationError.message,
        },
        action: 'create_consultation',
        metadata: { consultationData: { type: consultationData.type, email: consultationData.contact.email } },
      });
      throw new DatabaseError('상담 신청 처리 중 오류가 발생했습니다.', consultationError);
    }

    // 5. 타입별 세부 정보 저장
    if (consultationData.type === 'guided') {
      const { error: guidedError } = await supabaseAdmin
        .from('guided_consultations')
        .insert({
          consultation_id: consultation.id,
          service_type: consultationData.serviceType,
          project_size: consultationData.projectSize,
          budget: consultationData.budget,
          timeline: consultationData.timeline,
          important_features: consultationData.importantFeatures,
          additional_requests: consultationData.additionalRequests ? sanitizeInput(consultationData.additionalRequests) : null,
        });

      if (guidedError) {
        console.error('Guided consultation insert error:', guidedError);
        // 메인 레코드도 삭제
        await supabaseAdmin.from('consultations').delete().eq('id', consultation.id);

        throw new DatabaseError('가이드 상담 정보 저장 중 오류가 발생했습니다.', guidedError);
      }
    } else if (consultationData.type === 'free') {
      const { error: freeError } = await supabaseAdmin
        .from('free_consultations')
        .insert({
          consultation_id: consultation.id,
          project_description: sanitizeInput(consultationData.projectDescription),
          budget_range: consultationData.budget ? sanitizeInput(consultationData.budget) : null,
          timeline_preference: consultationData.timeline ? sanitizeInput(consultationData.timeline) : null,
        });

      if (freeError) {
        console.error('Free consultation insert error:', freeError);
        // 메인 레코드도 삭제
        await supabaseAdmin.from('consultations').delete().eq('id', consultation.id);

        throw new DatabaseError('자유 상담 정보 저장 중 오류가 발생했습니다.', freeError);
      }
    }

    // 6. 로그 기록
    await supabaseAdmin
      .from('consultation_logs')
      .insert({
        consultation_id: consultation.id,
        action: 'created',
        details: {
          type: consultationData.type,
          ip_address: ipAddress,
          user_agent: parseUserAgent(userAgent),
          utm_params: utmParams,
        },
        actor_type: 'system',
      });

    // 7. 예상 연락 시간 계산
    const estimatedContactTime = getEstimatedProcessingTime(consultationData.type);

  // 8. 성공 로깅
  logger.businessEvent('consultation_created', 'consultation', {
    metadata: {
      consultationId: consultation.id,
      consultationNumber: consultation.consultation_number,
      type: consultationData.type,
      version: 'v1',
    },
  });

  // 9. v1 형식 응답 (success 필드 없음)
  const v1Response: V1ConsultationResponse = {
    consultationId: consultation.id,
    consultationNumber: consultation.consultation_number,
    estimatedContactTime,
  };

  return res.status(201).json(v1Response);
}

export default withPublicApi(consultationSubmitV1Handler, presetConfigs.consultationSubmit);