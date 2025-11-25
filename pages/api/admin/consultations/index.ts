/**
 * 상담 목록 조회 API
 * GET /api/admin/consultations - 상담 목록 조회 (페이징, 필터링)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import type { ConsultationDetailsView, ConsultationStatus, ConsultationPriority } from '@/types/database';

export interface ConsultationItem {
  id: string;
  consultationNumber: string;
  name: string;
  company: string | null;
  email: string;
  phone: string;
  consultationType: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  status: ConsultationStatus;
  priority: ConsultationPriority;
  assignedTo?: string | null;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
  tags: string[];
  source?: string;
  referrer?: string;
  serviceType?: string | null;
  projectSize?: string | null;
  importantFeatures?: string[] | null;
  additionalRequests?: string | null;
  projectDescription?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export interface ConsultationListResponse {
  consultations: ConsultationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

// 상담 타입별 한글 매핑
const getConsultationTypeKorean = (type: string): string => {
  const typeMap: Record<string, string> = {
    guided: '가이드 상담',
    free: '자유 상담'
  };
  return typeMap[type] || type;
};

// 서비스 타입 한글 매핑
const getServiceTypeKorean = (serviceType: string | null): string => {
  if (!serviceType) return '';
  const serviceMap: Record<string, string> = {
    web_development: '웹사이트 제작',
    mobile_app: '모바일 앱 개발',
    desktop_app: '데스크톱 앱 개발',
    ai_ml: 'AI/ML',
    blockchain: '블록체인',
    iot: 'IoT',
    consulting: '컨설팅',
    maintenance: '유지보수',
    other: '기타'
  };
  return serviceMap[serviceType] || serviceType;
};

// 예산 범위 한글 매핑
const getBudgetKorean = (budget: string | null): string => {
  if (!budget) return '';
  const budgetMap: Record<string, string> = {
    under_1000: '100만원 미만',
    '1000_to_3000': '100-300만원',
    '3000_to_5000': '300-500만원',
    '5000_to_10000': '500-1000만원',
    over_10000: '1000만원 이상',
    negotiable: '협의 가능'
  };
  return budgetMap[budget] || budget;
};

// 타임라인 한글 매핑
const getTimelineKorean = (timeline: string | null): string => {
  if (!timeline) return '';
  const timelineMap: Record<string, string> = {
    asap: '가능한 빨리',
    '1_month': '1개월 이내',
    '1_3_months': '1-3개월',
    '3_6_months': '3-6개월',
    '6_12_months': '6-12개월',
    over_1_year: '1년 이상',
    flexible: '유연함'
  };
  return timelineMap[timeline] || timeline;
};

// Supabase 데이터를 ConsultationItem으로 변환
const transformConsultationData = (consultation: ConsultationDetailsView): ConsultationItem => {
  return {
    id: consultation.id,
    consultationNumber: consultation.consultation_number,
    name: consultation.contact_name,
    company: consultation.contact_company,
    email: consultation.contact_email,
    phone: consultation.contact_phone,
    consultationType: getConsultationTypeKorean(consultation.type),
    projectType: consultation.type === 'guided' ? getServiceTypeKorean(consultation.service_type) : undefined,
    budget: consultation.type === 'guided'
      ? getBudgetKorean(consultation.budget)
      : consultation.budget_range || undefined,
    timeline: consultation.type === 'guided'
      ? getTimelineKorean(consultation.timeline)
      : consultation.timeline_preference || undefined,
    message: consultation.type === 'guided'
      ? consultation.additional_requests || undefined
      : consultation.project_description || undefined,
    status: consultation.status,
    priority: consultation.priority,
    assignedTo: consultation.assigned_to,
    assignedToName: consultation.assigned_to_name,
    createdAt: consultation.created_at,
    updatedAt: consultation.updated_at,
    tags: [], // TODO: 태그 시스템 구현 필요
    source: consultation.utm_source || '직접 방문',
    referrer: consultation.utm_campaign || undefined,
    serviceType: consultation.service_type,
    projectSize: consultation.project_size,
    importantFeatures: consultation.important_features,
    additionalRequests: consultation.additional_requests,
    projectDescription: consultation.project_description,
    utmSource: consultation.utm_source,
    utmMedium: consultation.utm_medium,
    utmCampaign: consultation.utm_campaign
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 쿼리 파라미터 파싱
    const {
      page = '1',
      limit = '10',
      status,
      priority,
      assignedTo,
      startDate,
      endDate,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Supabase 쿼리 구성
    let query = supabaseAdmin
      .from('consultation_details')
      .select('*', { count: 'exact' });

    // 필터 적용
    if (status) {
      query = query.eq('status', status as ConsultationStatus);
    }

    if (priority) {
      query = query.eq('priority', priority as ConsultationPriority);
    }

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo as string);
    }

    if (startDate && endDate) {
      query = query
        .gte('created_at', startDate)
        .lte('created_at', endDate);
    }

    // 검색 (이름, 회사, 이메일에서 검색)
    if (search) {
      const searchTerm = search as string;
      query = query.or(
        `contact_name.ilike.%${searchTerm}%,contact_company.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%`
      );
    }

    // 정렬
    const orderColumn = sortBy as string;
    const ascending = sortOrder === 'asc';
    query = query.order(orderColumn, { ascending });

    // 페이징
    query = query.range(offset, offset + limitNum - 1);

    const { data: consultationsData, error: consultationsError, count } = await query;

    if (consultationsError) {
      console.error('Supabase query error:', consultationsError);
      throw new Error('Failed to fetch consultations from database');
    }

    // 데이터 변환
    const consultations = (consultationsData || []).map(transformConsultationData);

    const total = count || 0;
    const totalPages = Math.ceil(total / limitNum);

    const response: ConsultationListResponse = {
      consultations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      },
      filters: {
        status: status as string,
        priority: priority as string,
        assignedTo: assignedTo as string,
        dateRange: startDate && endDate ? {
          start: startDate as string,
          end: endDate as string
        } : undefined
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}