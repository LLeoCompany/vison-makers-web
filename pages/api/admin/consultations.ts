/**
 * 관리자 상담 목록 조회 API
 * GET /api/admin/consultations
 */

import { NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import { ConsultationQuerySchema } from '@/schemas/consultation';
import { formatDate, getStatusLabel, getTypeLabel, getPriorityLabel } from '@/utils/consultation';
import { withAuth, AuthenticatedRequest, authMiddlewares } from '@/middleware/auth';

interface ConsultationListResponse {
  success: true;
  data: {
    consultations: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters: {
      status?: string;
      type?: string;
      priority?: string;
      dateFrom?: string;
      dateTo?: string;
      search?: string;
    };
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

async function consultationsHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<ConsultationListResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET 메서드만 허용됩니다.',
      },
    });
  }

  try {
    // 쿼리 파라미터 검증
    const queryParams = {
      ...req.query,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    };

    const validationResult = ConsultationQuerySchema.safeParse(queryParams);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '쿼리 파라미터가 유효하지 않습니다.',
        },
      });
    }

    const {
      status,
      type,
      priority,
      dateFrom,
      dateTo,
      page,
      limit,
      search,
    } = validationResult.data;

    // 기본 쿼리 빌더
    let query = supabaseAdmin
      .from('consultation_details')
      .select('*', { count: 'exact' });

    // 필터 적용
    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (priority) {
      query = query.eq('priority', priority);
    }

    if (dateFrom) {
      query = query.gte('created_at', `${dateFrom}T00:00:00Z`);
    }

    if (dateTo) {
      query = query.lte('created_at', `${dateTo}T23:59:59Z`);
    }

    if (search) {
      query = query.or(`
        consultation_number.ilike.%${search}%,
        contact_name.ilike.%${search}%,
        contact_email.ilike.%${search}%,
        contact_company.ilike.%${search}%
      `);
    }

    // 페이지네이션 및 정렬
    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: consultations, error, count } = await query;

    if (error) {
      console.error('Admin consultations query error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: '상담 목록 조회 중 오류가 발생했습니다.',
        },
      });
    }

    // 데이터 가공
    const processedConsultations = consultations?.map((consultation) => ({
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
    })) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    return res.status(200).json({
      success: true,
      data: {
        consultations: processedConsultations,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
        filters: {
          status,
          type,
          priority,
          dateFrom,
          dateTo,
          search,
        },
      },
    });

  } catch (error) {
    console.error('Admin consultations API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
      },
    });
  }
}

// 읽기 권한이 필요한 관리자 API로 래핑
export default withAuth(consultationsHandler, authMiddlewares.readAccess);