/**
 * 특정 상담 상세 조회 및 업데이트 API
 * GET/PUT /api/admin/consultation/[id]
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { StatusUpdateSchema } from '@/schemas/consultation';
import { formatDate, getStatusLabel, getTypeLabel, getPriorityLabel } from '@/utils/consultation';

interface ConsultationDetailResponse {
  success: true;
  data: {
    consultation: any;
    logs: any[];
  };
}

interface ConsultationUpdateResponse {
  success: true;
  data: {
    consultation: any;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConsultationDetailResponse | ConsultationUpdateResponse | ErrorResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PARAMETER',
        message: '상담 ID가 유효하지 않습니다.',
      },
    });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, id);
  } else if (req.method === 'PUT') {
    return handlePut(req, res, id);
  } else {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET, PUT 메서드만 허용됩니다.',
      },
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ConsultationDetailResponse | ErrorResponse>,
  id: string
) {
  try {
    // 상담 상세 정보 조회
    const { data: consultation, error: consultationError } = await supabaseAdmin
      .from('consultation_details')
      .select('*')
      .eq('id', id)
      .single();

    if (consultationError || !consultation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '해당 상담을 찾을 수 없습니다.',
        },
      });
    }

    // 로그 조회
    const { data: logs, error: logsError } = await supabaseAdmin
      .from('consultation_logs')
      .select('*')
      .eq('consultation_id', id)
      .order('created_at', { ascending: false });

    if (logsError) {
      console.error('Consultation logs query error:', logsError);
    }

    // 데이터 가공
    const processedConsultation = {
      id: consultation.id,
      consultationNumber: consultation.consultation_number,
      type: consultation.type,
      typeLabel: getTypeLabel(consultation.type),
      status: consultation.status,
      statusLabel: getStatusLabel(consultation.status),
      priority: consultation.priority,
      priorityLabel: getPriorityLabel(consultation.priority),
      contactInfo: {
        name: consultation.contact_name,
        email: consultation.contact_email,
        phone: consultation.contact_phone,
        company: consultation.contact_company,
        preferredContactTime: consultation.preferred_contact_time,
      },
      // 가이드 상담 정보
      ...(consultation.type === 'guided' && {
        guidedInfo: {
          serviceType: consultation.service_type,
          projectSize: consultation.project_size,
          budget: consultation.budget,
          timeline: consultation.timeline,
          importantFeatures: consultation.important_features,
          additionalRequests: consultation.additional_requests,
        },
      }),
      // 자유 상담 정보
      ...(consultation.type === 'free' && {
        freeInfo: {
          projectDescription: consultation.project_description,
          budgetRange: consultation.budget_range,
          timelinePreference: consultation.timeline_preference,
        },
      }),
      metadata: {
        ipAddress: consultation.ip_address,
        userAgent: consultation.user_agent,
        referrerUrl: consultation.referrer_url,
        utmSource: consultation.utm_source,
        utmMedium: consultation.utm_medium,
        utmCampaign: consultation.utm_campaign,
      },
      timestamps: {
        createdAt: formatDate(consultation.created_at),
        updatedAt: formatDate(consultation.updated_at),
        reviewedAt: consultation.reviewed_at ? formatDate(consultation.reviewed_at) : null,
        contactedAt: consultation.contacted_at ? formatDate(consultation.contacted_at) : null,
      },
    };

    const processedLogs = logs?.map((log) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      notes: log.notes,
      actorType: log.actor_type,
      actorId: log.actor_id,
      createdAt: formatDate(log.created_at),
    })) || [];

    return res.status(200).json({
      success: true,
      data: {
        consultation: processedConsultation,
        logs: processedLogs,
      },
    });

  } catch (error) {
    console.error('Consultation detail API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
      },
    });
  }
}

async function handlePut(
  req: NextApiRequest,
  res: NextApiResponse<ConsultationUpdateResponse | ErrorResponse>,
  id: string
) {
  try {
    // 요청 데이터 검증
    const validationResult = StatusUpdateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '업데이트 데이터가 유효하지 않습니다.',
        },
      });
    }

    const { status, notes, priority } = validationResult.data;

    // 기존 상담 정보 조회
    const { data: existingConsultation, error: fetchError } = await supabaseAdmin
      .from('consultations')
      .select('status, priority')
      .eq('id', id)
      .single();

    if (fetchError || !existingConsultation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '해당 상담을 찾을 수 없습니다.',
        },
      });
    }

    // 상담 정보 업데이트
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;

    const { data: updatedConsultation, error: updateError } = await supabaseAdmin
      .from('consultations')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Consultation update error:', updateError);
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: '상담 정보 업데이트 중 오류가 발생했습니다.',
        },
      });
    }

    // 로그 기록
    const logDetails: any = {};
    if (status && status !== existingConsultation.status) {
      logDetails.old_status = existingConsultation.status;
      logDetails.new_status = status;
    }
    if (priority && priority !== existingConsultation.priority) {
      logDetails.old_priority = existingConsultation.priority;
      logDetails.new_priority = priority;
    }

    if (Object.keys(logDetails).length > 0 || notes) {
      await supabaseAdmin
        .from('consultation_logs')
        .insert({
          consultation_id: id,
          action: 'updated',
          details: logDetails,
          notes: notes || null,
          actor_type: 'admin',
          actor_id: 'admin', // 실제로는 인증된 관리자 ID를 사용
        });
    }

    return res.status(200).json({
      success: true,
      data: {
        consultation: {
          id: updatedConsultation.id,
          consultationNumber: updatedConsultation.consultation_number,
          status: updatedConsultation.status,
          statusLabel: getStatusLabel(updatedConsultation.status),
          priority: updatedConsultation.priority,
          priorityLabel: getPriorityLabel(updatedConsultation.priority),
          updatedAt: formatDate(updatedConsultation.updated_at),
        },
      },
    });

  } catch (error) {
    console.error('Consultation update API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
      },
    });
  }
}