/**
 * 관리자 분석 데이터 API
 * GET /api/admin/analytics - 대시보드 분석 데이터 조회
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
import type { ConsultationStatus, ConsultationPriority } from '@/types/database';

export interface AnalyticsData {
  overview: {
    totalConsultations: number;
    pendingConsultations: number;
    inProgressConsultations: number;
    completedConsultations: number;
    cancelledConsultations: number;
    conversionRate: number;
    avgResponseTime: number; // 시간 단위
    customerSatisfaction: number; // 1-5 스케일
  };
  trends: {
    consultationsByDay: Array<{
      date: string;
      count: number;
      completed: number;
    }>;
    consultationsByType: Array<{
      type: string;
      count: number;
      percentage: number;
    }>;
    consultationsBySource: Array<{
      source: string;
      count: number;
      percentage: number;
    }>;
  };
  performance: {
    teamMembers: Array<{
      id: string;
      name: string;
      assignedCount: number;
      completedCount: number;
      completionRate: number;
      avgResponseTime: number;
      customerRating: number;
    }>;
    monthlyTargets: {
      target: number;
      achieved: number;
      achievementRate: number;
    };
  };
  recentActivity: Array<{
    id: string;
    type: 'new_consultation' | 'status_change' | 'assignment' | 'completion';
    title: string;
    description: string;
    timestamp: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }>;
}

// 실제 데이터베이스에서 분석 데이터 생성
const generateAnalyticsData = async (): Promise<AnalyticsData> => {
    // 전체 상담 통계
    const { data: statusCounts } = await supabaseAdmin
      .from('consultation_status_counts')
      .select('*');

    // 최근 30일 데이터
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 일별 상담 수
    const { data: dailyConsultations } = await supabaseAdmin
      .from('consultations')
      .select('created_at, status')
      .gte('created_at', thirtyDaysAgo.toISOString());

    // 일별 데이터 집계
    const consultationsByDay = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];

      const dayConsultations = (dailyConsultations || []).filter(c =>
        c.created_at.startsWith(dateStr)
      );

      const count = dayConsultations.length;
      const completed = dayConsultations.filter(c => c.status === 'completed').length;

      return {
        date: dateStr,
        count,
        completed
      };
    });

    // 상담 타입별 통계
    const { data: typeStats } = await supabaseAdmin
      .from('consultations')
      .select('type')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const typeCountMap = (typeStats || []).reduce((acc: Record<string, number>, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});

    const totalTypeCount = Object.values(typeCountMap).reduce((sum: number, count: number) => sum + count, 0);
    const consultationsByType = Object.entries(typeCountMap).map(([type, count]) => ({
      type: type === 'guided' ? '가이드 상담' : '자유 상담',
      count: count as number,
      percentage: totalTypeCount > 0 ? Math.round((count as number / totalTypeCount) * 100) : 0
    }));

    // 유입 경로별 통계
    const { data: sourceStats } = await supabaseAdmin
      .from('consultations')
      .select('utm_source')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const sourceCountMap = (sourceStats || []).reduce((acc: Record<string, number>, item) => {
      const source = item.utm_source || '직접 방문';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const totalSourceCount = Object.values(sourceCountMap).reduce((sum: number, count: number) => sum + count, 0);
    const consultationsBySource = Object.entries(sourceCountMap).map(([source, count]) => ({
      source,
      count: count as number,
      percentage: totalSourceCount > 0 ? Math.round((count as number / totalSourceCount) * 100) : 0
    }));

    // 팀멤버 성과 (예제 데이터)
    const teamMembers = [
      {
        id: 'manager-1',
        name: '김관리자',
        assignedCount: 25,
        completedCount: 18,
        completionRate: 72,
        avgResponseTime: 2.5,
        customerRating: 4.5
      },
      {
        id: 'manager-2',
        name: '이매니저',
        assignedCount: 22,
        completedCount: 19,
        completionRate: 86,
        avgResponseTime: 1.8,
        customerRating: 4.7
      },
      {
        id: 'manager-3',
        name: '박팀장',
        assignedCount: 18,
        completedCount: 15,
        completionRate: 83,
        avgResponseTime: 3.2,
        customerRating: 4.3
      }
    ];

    // 최근 활동 (consultations 테이블에서 가져오기)
    const { data: recentConsultations } = await supabaseAdmin
      .from('consultations')
      .select(`
        id,
        status,
        created_at,
        updated_at,
        contact_name,
        contact_company,
        priority
      `)
      .order('updated_at', { ascending: false })
      .limit(10);

    // 헬퍼 함수들
    const getActivityTitle = (status: string): string => {
      const titleMap: Record<string, string> = {
        pending: '새로운 상담 요청',
        contacted: '고객 연락 완료',
        in_progress: '상담 진행 중',
        completed: '상담 완료',
        cancelled: '상담 취소',
        on_hold: '상담 보류'
      };
      return titleMap[status] || '상담 활동';
    };

    const getActivityDescription = (status: string, consultation: any): string => {
      const name = consultation?.contact_name || '고객';
      const company = consultation?.contact_company;
      const companyText = company ? `${company}의 ` : '';

      switch (status) {
        case 'pending':
          return `${companyText}${name}님이 새로운 상담을 요청했습니다.`;
        case 'contacted':
          return `${companyText}${name}님에게 연락이 완료되었습니다.`;
        case 'in_progress':
          return `${companyText}${name}님 상담이 진행 중입니다.`;
        case 'completed':
          return `${companyText}${name}님 상담이 성공적으로 완료되었습니다.`;
        case 'cancelled':
          return `${companyText}${name}님 상담이 취소되었습니다.`;
        default:
          return `${companyText}${name}님 상담에 새로운 활동이 있습니다.`;
      }
    };

    const recentActivity = (recentConsultations || []).map((consultation: any) => {
      const activityType = consultation.status === 'pending' ? 'new_consultation' as const :
            consultation.status === 'in_progress' ? 'status_change' as const :
            consultation.status === 'completed' ? 'completion' as const : 'status_change' as const;
      return {
        id: consultation.id as string,
        type: activityType,
        title: getActivityTitle(consultation.status),
        description: getActivityDescription(consultation.status, consultation),
        timestamp: consultation.updated_at as string,
        priority: (consultation.priority || 'medium') as 'low' | 'medium' | 'high' | 'urgent'
      };
    });

    // 총계 계산
    const totalConsultations = consultationsByDay.reduce((sum, day) => sum + day.count, 0);
    const totalCompleted = consultationsByDay.reduce((sum, day) => sum + day.completed, 0);

    // 상태별 카운트 (실제 데이터에서)
    const statusCountsMap = (statusCounts || []).reduce((acc: Record<string, number>, item: any) => {
      acc[item.status] = item.count;
      return acc;
    }, {});

    const pendingConsultations = statusCountsMap['pending'] || 0;
    const inProgressConsultations = statusCountsMap['in_progress'] || 0;
    const cancelledConsultations = statusCountsMap['cancelled'] || 0;

    return {
      overview: {
        totalConsultations,
        pendingConsultations,
        inProgressConsultations,
        completedConsultations: totalCompleted,
        cancelledConsultations,
        conversionRate: totalConsultations > 0 ? Math.round((totalCompleted / totalConsultations) * 100) : 0,
        avgResponseTime: 2.3,
        customerSatisfaction: 4.5
      },
      trends: {
        consultationsByDay,
        consultationsByType,
        consultationsBySource
      },
      performance: {
        teamMembers,
        monthlyTargets: {
          target: 150,
          achieved: 128,
          achievementRate: 85
        }
      },
      recentActivity
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const analyticsData = await generateAnalyticsData();
    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Analytics API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}