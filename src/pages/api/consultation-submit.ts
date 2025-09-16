/**
 * VisionMakers 상담 시스템 - 상담 신청 API 엔드포인트
 * 기존 Slack 시스템과 연동하여 상담 신청을 처리
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { GuidedConsultation, FreeConsultation, ContactInfo } from '@/types/consultation';
import {
  sanitizeGuidedConsultationData,
  sanitizeFreeConsultationData,
  isSafeInput
} from '@/utils/sanitization';
import { API_ENDPOINTS } from '@/constants';

type ConsultationSubmission = {
  type: 'guided' | 'free';
  // Guided track fields
  serviceType?: string;
  projectSize?: string;
  budget?: string;
  timeline?: string;
  importantFeatures?: string[];
  additionalRequests?: string;
  // Free track fields
  projectDescription?: string;
  // Common fields
  contact: ContactInfo;
};

// 상담 신청 번호 생성
function generateConsultationId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VM-${dateStr}-${timeStr}-${randomStr}`;
}

// 상담 유형별 한국어 설명
const SERVICE_TYPE_KR = {
  'homepage': '회사 홈페이지',
  'shopping': '온라인 쇼핑몰',
  'booking': '예약/예매 시스템',
  'membership': '회원제 서비스',
  'other': '기타 (상담 필요)'
};

const PROJECT_SIZE_KR = {
  'small': '소규모 (5-10페이지)',
  'medium': '중간규모 (10-20페이지)',
  'large': '대규모 (20페이지 이상)'
};

const BUDGET_KR = {
  '100-300': '100-300만원',
  '300-800': '300-800만원',
  '800-1500': '800-1500만원',
  '1500+': '1500만원 이상',
  'consult': '상담 후 결정'
};

const TIMELINE_KR = {
  '1month': '1개월 내',
  '2-3months': '2-3개월 내',
  '6months': '6개월 내',
  'flexible': '일정 협의'
};

const FEATURE_KR = {
  'mobile': '모바일 최적화',
  'seo': 'SEO 최적화',
  'admin': '관리자 시스템',
  'payment': '결제 시스템'
};

// Guided 트랙 메시지 포맷팅
function formatGuidedMessage(data: ConsultationSubmission, consultationId: string): string {
  const features = data.importantFeatures?.length
    ? data.importantFeatures.map(f => FEATURE_KR[f as keyof typeof FEATURE_KR]).join(', ')
    : '선택 안함';

  return `
🎯 **새로운 가이드 상담 신청** (ID: ${consultationId})
===============================================

📋 **프로젝트 정보**
• 서비스 유형: ${SERVICE_TYPE_KR[data.serviceType as keyof typeof SERVICE_TYPE_KR] || data.serviceType}
• 프로젝트 규모: ${PROJECT_SIZE_KR[data.projectSize as keyof typeof PROJECT_SIZE_KR] || data.projectSize}
• 예상 예산: ${BUDGET_KR[data.budget as keyof typeof BUDGET_KR] || data.budget}
• 완성 희망 시기: ${TIMELINE_KR[data.timeline as keyof typeof TIMELINE_KR] || data.timeline}
• 중요 기능: ${features}

📝 **추가 요청사항**
${data.additionalRequests || '없음'}

👤 **고객 정보**
• 이름: ${data.contact.name}
• 연락처: ${data.contact.phone}
• 이메일: ${data.contact.email}
• 회사명: ${data.contact.company || '개인'}

⏰ **신청 시간**: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

📞 **다음 액션**: 1-2일 내 전화 상담 진행
===============================================
`;
}

// Free 트랙 메시지 포맷팅
function formatFreeMessage(data: ConsultationSubmission, consultationId: string): string {
  return `
📝 **새로운 자유 상담 신청** (ID: ${consultationId})
===============================================

📋 **프로젝트 설명**
${data.projectDescription}

💰 **예상 예산**: ${data.budget || '미정'}
⏰ **희망 완성 시기**: ${data.timeline || '미정'}

👤 **고객 정보**
• 이름: ${data.contact.name}
• 연락처: ${data.contact.phone}
• 이메일: ${data.contact.email}
• 회사명: ${data.contact.company || '개인'}

⏰ **신청 시간**: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}

📞 **다음 액션**: 1-2일 내 전화 상담 진행
===============================================
`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Consultation submission received:", req.method, req.body);

  // POST 메서드만 허용
  if (req.method !== 'POST') {
    console.log("Method not allowed");
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawData: ConsultationSubmission = req.body;

    // 기본 검증
    if (!rawData.type || !rawData.contact) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!rawData.contact.name || !rawData.contact.phone || !rawData.contact.email) {
      return res.status(400).json({ error: 'Missing contact information' });
    }

    // 입력값 안전성 검증
    const inputsToCheck = [
      rawData.contact.name,
      rawData.contact.email,
      rawData.projectDescription,
      rawData.additionalRequests
    ].filter(Boolean);

    for (const input of inputsToCheck) {
      if (!isSafeInput(input as string)) {
        return res.status(400).json({ error: 'Invalid input detected' });
      }
    }

    // 입력값 정화
    const data = rawData.type === 'guided'
      ? sanitizeGuidedConsultationData(rawData)
      : sanitizeFreeConsultationData(rawData);

    // 트랙별 검증
    if (data.type === 'guided') {
      if (!data.serviceType || !data.projectSize || !data.budget || !data.timeline) {
        return res.status(400).json({ error: 'Missing guided track required fields' });
      }
    } else if (data.type === 'free') {
      if (!data.projectDescription || data.projectDescription.trim().length < 20) {
        return res.status(400).json({ error: 'Project description must be at least 20 characters' });
      }
    }

    // 상담 신청 번호 생성
    const consultationId = generateConsultationId();

    // 메시지 포맷팅
    const message = data.type === 'guided'
      ? formatGuidedMessage(data, consultationId)
      : formatFreeMessage(data, consultationId);

    // Slack으로 메시지 전송
    const slackResponse = await fetch(
      API_ENDPOINTS.SLACK_WEBHOOK,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      }
    );

    console.log("Slack response status:", slackResponse.status);

    if (slackResponse.ok) {
      console.log("Consultation message sent to Slack successfully");
      res.status(200).json({
        success: true,
        consultationId,
        message: "Consultation submitted successfully"
      });
    } else {
      const errorText = await slackResponse.text();
      console.error("Failed to send message to Slack:", errorText);
      res.status(500).json({
        error: "Failed to send message to Slack",
        details: errorText
      });
    }

  } catch (error) {
    console.error("Error in consultation handler:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}