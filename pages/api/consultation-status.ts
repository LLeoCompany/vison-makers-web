/**
 * 상담 상태 조회 API 엔드포인트
 * GET /api/consultation-status?number={consultationNumber}
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { formatDate, getStatusLabel, getTypeLabel, maskEmail, maskPhone } from '@/utils/consultation';

interface ConsultationStatusResponse {
  success: true;
  data: {
    consultationNumber: string;
    type: string;
    typeLabel: string;
    status: string;
    statusLabel: string;
    contactInfo: {
      name: string;
      email: string;
      phone: string;
    };
    estimatedContactTime?: string;
    createdAt: string;
    updatedAt: string;
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
  res: NextApiResponse<ConsultationStatusResponse | ErrorResponse>
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

  const { number } = req.query;

  if (!number || typeof number !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PARAMETER',
        message: '상담 번호를 입력해주세요.',
      },
    });
  }

  // 상담 번호 형식 검증 (CS-YYYYMMDD-XXXX)
  const consultationNumberPattern = /^CS-\d{8}-\d{4}$/;
  if (!consultationNumberPattern.test(number)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FORMAT',
        message: '올바른 상담 번호 형식이 아닙니다.',
      },
    });
  }

  try {
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select(`
        id,
        consultation_number,
        type,
        status,
        contact_name,
        contact_email,
        contact_phone,
        created_at,
        updated_at
      `)
      .eq('consultation_number', number)
      .single();

    if (error || !consultation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '해당 상담 번호를 찾을 수 없습니다.',
        },
      });
    }

    // 예상 연락 시간 계산 (상태에 따라)
    let estimatedContactTime: string | undefined;
    if (consultation.status === 'pending') {
      estimatedContactTime = consultation.type === 'guided' ? '2-4시간 내' : '4-8시간 내';
    } else if (consultation.status === 'reviewing') {
      estimatedContactTime = '검토 중입니다';
    } else if (consultation.status === 'contacted') {
      estimatedContactTime = '연락 완료';
    } else if (consultation.status === 'completed') {
      estimatedContactTime = '상담 완료';
    } else if (consultation.status === 'cancelled') {
      estimatedContactTime = '상담 취소됨';
    }

    return res.status(200).json({
      success: true,
      data: {
        consultationNumber: consultation.consultation_number,
        type: consultation.type,
        typeLabel: getTypeLabel(consultation.type),
        status: consultation.status,
        statusLabel: getStatusLabel(consultation.status),
        contactInfo: {
          name: consultation.contact_name,
          email: maskEmail(consultation.contact_email),
          phone: maskPhone(consultation.contact_phone),
        },
        estimatedContactTime,
        createdAt: formatDate(consultation.created_at),
        updatedAt: formatDate(consultation.updated_at),
      },
    });

  } catch (error) {
    console.error('Consultation status API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
      },
    });
  }
}