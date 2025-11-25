/**
 * 상담 상세 조회 및 업데이트 API
 * GET /api/admin/consultations/[id] - 상담 상세 조회
 * PUT /api/admin/consultations/[id] - 상담 정보 업데이트
 * DELETE /api/admin/consultations/[id] - 상담 삭제
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import type { ConsultationItem } from './index';
import { supabaseAdmin } from '@/lib/supabase';
import type { ConsultationDetailsView, ConsultationStatus, ConsultationPriority } from '@/types/database';
import { triggerStatusChangeNotification, triggerAssignmentNotification } from '@/utils/adminNotificationTrigger';

export interface ConsultationDetailResponse extends Omit<ConsultationItem, 'timeline'> {
  notes: ConsultationNote[];
  attachments: ConsultationAttachment[];
  timeline: ConsultationTimelineEvent[];
}

export interface ConsultationNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isInternal: boolean;
}

export interface ConsultationAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface ConsultationTimelineEvent {
  id: string;
  type: 'created' | 'status_changed' | 'assigned' | 'note_added' | 'contacted' | 'updated';
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface UpdateConsultationRequest {
  status?: ConsultationItem['status'];
  priority?: ConsultationItem['priority'];
  assignedTo?: string;
  tags?: string[];
  note?: {
    content: string;
    isInternal: boolean;
  };
}

// Supabase에서 상담 상세 정보 조회
const fetchConsultationDetail = async (id: string): Promise<ConsultationItem | null> => {
  const { data, error } = await supabaseAdmin
    .from('consultation_details')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  // 데이터 변환 (이전에 정의한 함수 사용)
  return {
    id: data.id,
    consultationNumber: data.consultation_number,
    name: data.contact_name,
    company: data.contact_company,
    email: data.contact_email,
    phone: data.contact_phone,
    consultationType: data.type === 'guided' ? '가이드 상담' : '자유 상담',
    projectType: data.service_type ?? undefined,
    budget: (data.budget || data.budget_range) ?? undefined,
    timeline: (data.timeline || data.timeline_preference) ?? undefined,
    message: (data.additional_requests || data.project_description) ?? undefined,
    status: data.status,
    priority: data.priority,
    assignedTo: data.assigned_to,
    assignedToName: data.assigned_to_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    tags: [],
    source: data.utm_source || '직접 방문',
    referrer: data.utm_campaign ?? undefined,
    serviceType: data.service_type,
    projectSize: data.project_size,
    importantFeatures: data.important_features,
    additionalRequests: data.additional_requests,
    projectDescription: data.project_description,
    utmSource: data.utm_source,
    utmMedium: data.utm_medium,
    utmCampaign: data.utm_campaign
  };
};

// 상담 로그 조회
const fetchConsultationLogs = async (consultationId: string): Promise<ConsultationTimelineEvent[]> => {
  const { data, error } = await supabaseAdmin
    .from('consultation_logs')
    .select('*')
    .eq('consultation_id', consultationId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((log, index) => ({
    id: log.id || `log-${index}`,
    type: log.action as ConsultationTimelineEvent['type'],
    title: getActionTitle(log.action),
    description: getActionDescription(log.action, log.details),
    authorId: log.actor_id || 'system',
    authorName: log.actor_type === 'system' ? '시스템' : '관리자',
    createdAt: log.created_at,
    metadata: (log.details as Record<string, any>) ?? undefined
  }));
};

// 액션별 제목 생성
const getActionTitle = (action: string): string => {
  const actionMap: Record<string, string> = {
    created: '상담 요청 접수',
    updated: '상담 정보 수정',
    status_changed: '상태 변경',
    assigned: '담당자 배정',
    contacted: '고객 연락',
    completed: '상담 완료',
    cancelled: '상담 취소',
    note_added: '노트 추가'
  };
  return actionMap[action] || action;
};

// 액션별 설명 생성
const getActionDescription = (action: string, details: any): string => {
  switch (action) {
    case 'created':
      return '새로운 상담 요청이 접수되었습니다.';
    case 'status_changed':
      return `상태가 ${details?.from || ''}에서 ${details?.to || ''}로 변경되었습니다.`;
    case 'assigned':
      return `담당자가 배정되었습니다.`;
    case 'contacted':
      return '고객과 연락을 진행했습니다.';
    case 'note_added':
      return '새로운 노트가 추가되었습니다.';
    default:
      return `${action} 작업이 수행되었습니다.`;
  }
};

// 목 데이터 생성 (노트와 첨부파일용)
const generateMockConsultationDetail = async (id: string): Promise<ConsultationDetailResponse | null> => {
  const baseConsultation = await fetchConsultationDetail(id);

  if (!baseConsultation) {
    return null;
  }

  // TODO: 실제 노트 시스템 구현 필요
  const notes: ConsultationNote[] = [];

  const attachments: ConsultationAttachment[] = [
    {
      id: 'attachment-1',
      fileName: '요구사항정리서.pdf',
      fileSize: 1024000,
      fileType: 'application/pdf',
      uploadedBy: 'manager-1',
      uploadedAt: '2024-01-15T11:00:00Z',
      downloadUrl: '/api/admin/attachments/attachment-1'
    },
    {
      id: 'attachment-2',
      fileName: '제안서_v1.0.pdf',
      fileSize: 2048000,
      fileType: 'application/pdf',
      uploadedBy: 'manager-1',
      uploadedAt: '2024-01-16T13:00:00Z',
      downloadUrl: '/api/admin/attachments/attachment-2'
    }
  ];

  // 실제 상담 로그에서 타임라인 생성
  const timeline = await fetchConsultationLogs(id);

  return {
    ...baseConsultation,
    notes,
    attachments,
    timeline
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid consultation ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return handleGet(req, res, id);
      case 'PUT':
        return handlePut(req, res, id);
      case 'DELETE':
        return handleDelete(req, res, id);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET - 상담 상세 조회
async function handleGet(req: NextApiRequest, res: NextApiResponse, id: string) {
  const consultation = await generateMockConsultationDetail(id);

  if (!consultation) {
    return res.status(404).json({ error: 'Consultation not found' });
  }

  res.status(200).json(consultation);
}

// PUT - 상담 정보 업데이트
async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
  const updateData: UpdateConsultationRequest = req.body;

  try {
    // 기존 상담 정보 조회
    const existingConsultation = await fetchConsultationDetail(id);
    if (!existingConsultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // 상담 기본 정보 업데이트
    const updateFields: any = {
      updated_at: new Date().toISOString()
    };

    if (updateData.status) {
      updateFields.status = updateData.status;

      // 상태별 타임스탬프 업데이트
      if (updateData.status === 'completed') {
        updateFields.completed_at = new Date().toISOString();
      }
    }

    if (updateData.priority) {
      updateFields.priority = updateData.priority;
    }

    if (updateData.assignedTo) {
      updateFields.assigned_to = updateData.assignedTo;
      updateFields.assigned_at = new Date().toISOString();
    }

    // 상담 정보 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('consultations')
      .update(updateFields)
      .eq('id', id);

    if (updateError) {
      throw new Error(`Failed to update consultation: ${updateError.message}`);
    }

    // 로그 추가
    // 상태 변경 로그
    if (updateData.status && updateData.status !== existingConsultation.status) {
      await supabaseAdmin.from('consultation_logs').insert({
        consultation_id: id,
        action: 'status_changed',
        details: {
          from: existingConsultation.status,
          to: updateData.status
        },
        actor_type: 'admin',
        actor_id: 'admin-session' // TODO: 실제 관리자 ID 사용
      });
    }

    // 담당자 배정 로그
    if (updateData.assignedTo && updateData.assignedTo !== existingConsultation.assignedTo) {
      await supabaseAdmin.from('consultation_logs').insert({
        consultation_id: id,
        action: 'assigned',
        details: {
          assignedTo: updateData.assignedTo,
          previousAssignee: existingConsultation.assignedTo
        },
        actor_type: 'admin',
        actor_id: 'admin-session'
      });
    }

    // 노트 추가 로그
    if (updateData.note) {
      await supabaseAdmin.from('consultation_logs').insert({
        consultation_id: id,
        action: 'note_added',
        details: {
          content: updateData.note.content,
          isInternal: updateData.note.isInternal
        },
        actor_type: 'admin',
        actor_id: 'admin-session'
      });
    }

    // 알림 트리거
    const notificationPromises: Promise<any>[] = [];

    // 상태 변경 알림
    if (updateData.status && updateData.status !== existingConsultation.status) {
      notificationPromises.push(
        triggerStatusChangeNotification(
          id,
          existingConsultation.status,
          updateData.status,
          'admin-session'
        ).catch(error => console.error('Status change notification failed:', error))
      );
    }

    // 담당자 배정 알림
    if (updateData.assignedTo && updateData.assignedTo !== existingConsultation.assignedTo) {
      notificationPromises.push(
        triggerAssignmentNotification(
          id,
          updateData.assignedTo,
          'admin-session'
        ).catch(error => console.error('Assignment notification failed:', error))
      );
    }

    // 알림 트리거 (비동기, 실패해도 메인 프로세스에 영향 없음)
    Promise.all(notificationPromises);

    // 업데이트된 상담 정보 반환
    const updatedConsultation = await generateMockConsultationDetail(id);
    res.status(200).json(updatedConsultation);

  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      error: 'Failed to update consultation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// DELETE - 상담 삭제
async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // 상담 존재 확인
    const existingConsultation = await fetchConsultationDetail(id);
    if (!existingConsultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // 상담 삭제 (연관된 데이터도 CASCADE로 삭제됨)
    const { error: deleteError } = await supabaseAdmin
      .from('consultations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(`Failed to delete consultation: ${deleteError.message}`);
    }

    res.status(200).json({ message: 'Consultation deleted successfully', id });

  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      error: 'Failed to delete consultation',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}