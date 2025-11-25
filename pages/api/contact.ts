/**
 * 문의하기 API 엔드포인트 (Slack 알림)
 * POST /api/contact
 */

import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

// 요청 스키마 정의
const ContactRequestSchema = z.object({
  type: z.enum(["guided", "free"]),
  contact: z.object({
    name: z.string().min(2, "이름은 2자 이상 입력해주세요"),
    phone: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, "올바른 전화번호를 입력해주세요"),
    email: z.string().email("올바른 이메일을 입력해주세요"),
    company: z.string().optional(),
    preferredContactTime: z.enum(["morning", "afternoon", "evening", "anytime"]).optional(),
  }),
  // Guided 트랙
  serviceType: z.string().optional(),
  projectSize: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  importantFeatures: z.array(z.string()).optional(),
  additionalRequests: z.string().optional(),
  // Free 트랙
  projectDescription: z.string().optional(),
});

// 응답 타입
interface ContactResponse {
  success: boolean;
  data?: {
    consultationNumber: string;
    estimatedContactTime: string;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 상담 번호 생성
function generateConsultationNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LFT-${year}${month}${day}-${random}`;
}

// XSS 방지를 위한 입력 정제
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// 한글 라벨 변환
const SERVICE_TYPE_LABELS: Record<string, string> = {
  homepage: "홈페이지 제작",
  shopping: "쇼핑몰 제작",
  booking: "예약 시스템",
  membership: "회원제 서비스",
  web_development: "웹 개발",
  mobile_app: "모바일 앱",
  desktop_app: "데스크탑 앱",
  ai_ml: "AI/머신러닝",
  blockchain: "블록체인",
  iot: "IoT",
  consulting: "IT 컨설팅",
  maintenance: "유지보수",
  other: "기타",
};

const PROJECT_SIZE_LABELS: Record<string, string> = {
  small: "소규모 (5-10 페이지)",
  medium: "중규모 (10-20 페이지)",
  large: "대규모 (20페이지 이상)",
};

const BUDGET_LABELS: Record<string, string> = {
  under_1000: "100만원 미만",
  "1000_to_3000": "100-300만원",
  "3000_to_5000": "300-500만원",
  "5000_to_10000": "500-1000만원",
  over_10000: "1000만원 이상",
  negotiable: "협의 필요",
};

const TIMELINE_LABELS: Record<string, string> = {
  asap: "최대한 빨리",
  "1_month": "1개월 이내",
  "1_3_months": "1-3개월",
  "3_6_months": "3-6개월",
  "6_12_months": "6-12개월",
  over_1_year: "1년 이상",
  flexible: "유동적",
};

const CONTACT_TIME_LABELS: Record<string, string> = {
  morning: "오전 (9시-12시)",
  afternoon: "오후 (1시-6시)",
  evening: "저녁 (6시-8시)",
  anytime: "언제든 가능",
};

const FEATURE_LABELS: Record<string, string> = {
  mobile: "모바일 최적화",
  seo: "SEO 최적화",
  admin: "관리자 페이지",
  payment: "결제 기능",
};

// Slack 메시지 전송
async function sendSlackNotification(data: {
  consultationNumber: string;
  type: "guided" | "free";
  contact: {
    name: string;
    phone: string;
    email: string;
    company?: string;
    preferredContactTime?: string;
  };
  serviceType?: string;
  projectSize?: string;
  budget?: string;
  timeline?: string;
  importantFeatures?: string[];
  additionalRequests?: string;
  projectDescription?: string;
}): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL not configured");
    return false;
  }

  const trackType = data.type === "guided" ? "가이드 상담" : "자유 상담";
  const submittedAt = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  // Slack Block Kit 메시지 구성
  const blocks: any[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🔔 새로운 상담 문의",
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*상담 번호:*\n${data.consultationNumber}`,
        },
        {
          type: "mrkdwn",
          text: `*상담 유형:*\n${trackType}`,
        },
      ],
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📋 연락처 정보*",
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*이름:*\n${data.contact.name}`,
        },
        {
          type: "mrkdwn",
          text: `*연락처:*\n${data.contact.phone}`,
        },
        {
          type: "mrkdwn",
          text: `*이메일:*\n${data.contact.email}`,
        },
        {
          type: "mrkdwn",
          text: `*연락 희망:*\n${CONTACT_TIME_LABELS[data.contact.preferredContactTime || ""] || "미지정"}`,
        },
      ],
    },
  ];

  // 회사 정보 추가
  if (data.contact.company) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*회사/단체:* ${data.contact.company}`,
      },
    });
  }

  blocks.push({ type: "divider" });

  // 상담 상세 정보
  if (data.type === "guided") {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📝 상담 상세 정보*",
      },
    });

    const detailFields = [
      {
        type: "mrkdwn",
        text: `*서비스 종류:*\n${SERVICE_TYPE_LABELS[data.serviceType || ""] || data.serviceType || "-"}`,
      },
      {
        type: "mrkdwn",
        text: `*프로젝트 규모:*\n${PROJECT_SIZE_LABELS[data.projectSize || ""] || data.projectSize || "-"}`,
      },
      {
        type: "mrkdwn",
        text: `*예산:*\n${BUDGET_LABELS[data.budget || ""] || data.budget || "-"}`,
      },
      {
        type: "mrkdwn",
        text: `*희망 일정:*\n${TIMELINE_LABELS[data.timeline || ""] || data.timeline || "-"}`,
      },
    ];

    blocks.push({
      type: "section",
      fields: detailFields,
    });

    if (data.importantFeatures && data.importantFeatures.length > 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*중요 기능:* ${data.importantFeatures.map(f => FEATURE_LABELS[f] || f).join(", ")}`,
        },
      });
    }

    if (data.additionalRequests) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*추가 요청사항:*\n${data.additionalRequests}`,
        },
      });
    }
  } else {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📝 프로젝트 설명*",
      },
    });

    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: data.projectDescription || "-",
      },
    });

    if (data.budget || data.timeline) {
      const freeFields = [];
      if (data.budget) {
        freeFields.push({
          type: "mrkdwn",
          text: `*예산:*\n${data.budget}`,
        });
      }
      if (data.timeline) {
        freeFields.push({
          type: "mrkdwn",
          text: `*희망 일정:*\n${data.timeline}`,
        });
      }
      blocks.push({
        type: "section",
        fields: freeFields,
      });
    }
  }

  // 접수 시간
  blocks.push(
    { type: "divider" },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `⏰ 접수 시간: ${submittedAt}`,
        },
      ],
    }
  );

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blocks }),
    });

    if (!response.ok) {
      console.error("Slack webhook error:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Slack notification:", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // OPTIONS 요청 처리
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // POST만 허용
  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "POST 메서드만 허용됩니다.",
      },
    });
    return;
  }

  try {
    // 1. 요청 데이터 검증
    const validationResult = ContactRequestSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "입력 데이터가 유효하지 않습니다.",
          details: validationResult.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
      });
      return;
    }

    const data = validationResult.data;

    // 2. Free 트랙 추가 검증
    if (data.type === "free" && (!data.projectDescription || data.projectDescription.length < 20)) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "프로젝트 설명은 20자 이상 입력해주세요.",
        },
      });
      return;
    }

    // 3. 상담 번호 생성
    const consultationNumber = generateConsultationNumber();

    // 4. Slack 알림 전송
    const slackData = {
      consultationNumber,
      type: data.type,
      contact: {
        name: sanitizeInput(data.contact.name),
        phone: sanitizeInput(data.contact.phone),
        email: sanitizeInput(data.contact.email),
        company: data.contact.company ? sanitizeInput(data.contact.company) : undefined,
        preferredContactTime: data.contact.preferredContactTime,
      },
      serviceType: data.serviceType,
      projectSize: data.projectSize,
      budget: data.budget,
      timeline: data.timeline,
      importantFeatures: data.importantFeatures,
      additionalRequests: data.additionalRequests ? sanitizeInput(data.additionalRequests) : undefined,
      projectDescription: data.projectDescription ? sanitizeInput(data.projectDescription) : undefined,
    };

    const slackSent = await sendSlackNotification(slackData);

    if (!slackSent) {
      console.error("Slack notification failed");
      res.status(500).json({
        success: false,
        error: {
          code: "NOTIFICATION_FAILED",
          message: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        },
      });
      return;
    }

    // 5. 성공 응답
    console.log(`Consultation submitted via Slack: ${consultationNumber}`);

    res.status(201).json({
      success: true,
      data: {
        consultationNumber,
        estimatedContactTime: "영업일 기준 24시간 이내",
      },
    });
  } catch (error) {
    console.error("Contact API error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
    });
  }
}
