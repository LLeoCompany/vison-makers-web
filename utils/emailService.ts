/**
 * 이메일 전송 서비스
 * Resend API 사용
 */

import { Resend } from "resend";

// 상담 문의 데이터 인터페이스
export interface ConsultationEmailData {
  type: "guided" | "free";
  contact: {
    name: string;
    phone: string;
    email: string;
    company?: string;
    preferredContactTime?: string;
  };
  // Guided 트랙
  serviceType?: string;
  projectSize?: string;
  budget?: string;
  timeline?: string;
  importantFeatures?: string[];
  additionalRequests?: string;
  // Free 트랙
  projectDescription?: string;
  // 메타데이터
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    submittedAt?: string;
  };
}

// Resend 클라이언트 생성
function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }
  return new Resend(apiKey);
}

// 서비스 타입 한글 변환
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

// 프로젝트 규모 한글 변환
const PROJECT_SIZE_LABELS: Record<string, string> = {
  small: "소규모 (5-10 페이지)",
  medium: "중규모 (10-20 페이지)",
  large: "대규모 (20페이지 이상)",
};

// 예산 한글 변환
const BUDGET_LABELS: Record<string, string> = {
  under_1000: "100만원 미만",
  "1000_to_3000": "100-300만원",
  "3000_to_5000": "300-500만원",
  "5000_to_10000": "500-1000만원",
  over_10000: "1000만원 이상",
  negotiable: "협의 필요",
};

// 일정 한글 변환
const TIMELINE_LABELS: Record<string, string> = {
  asap: "최대한 빨리",
  "1_month": "1개월 이내",
  "1_3_months": "1-3개월",
  "3_6_months": "3-6개월",
  "6_12_months": "6-12개월",
  over_1_year: "1년 이상",
  flexible: "유동적",
};

// 연락 시간 한글 변환
const CONTACT_TIME_LABELS: Record<string, string> = {
  morning: "오전 (9시-12시)",
  afternoon: "오후 (1시-6시)",
  evening: "저녁 (6시-8시)",
  anytime: "언제든 가능",
};

// 중요 기능 한글 변환
const FEATURE_LABELS: Record<string, string> = {
  mobile: "모바일 최적화",
  seo: "SEO 최적화",
  admin: "관리자 페이지",
  payment: "결제 기능",
};

// 상담 문의 이메일 HTML 생성
function generateConsultationEmailHTML(data: ConsultationEmailData, consultationNumber: string): string {
  const submittedAt = data.metadata?.submittedAt || new Date().toISOString();
  const formattedDate = new Date(submittedAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const trackType = data.type === "guided" ? "가이드 상담" : "자유 상담";

  let detailsHTML = "";

  if (data.type === "guided") {
    detailsHTML = `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 140px; background-color: #f9fafb;">서비스 종류</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${SERVICE_TYPE_LABELS[data.serviceType || ""] || data.serviceType || "-"}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">프로젝트 규모</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${PROJECT_SIZE_LABELS[data.projectSize || ""] || data.projectSize || "-"}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">예산</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${BUDGET_LABELS[data.budget || ""] || data.budget || "-"}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">희망 일정</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${TIMELINE_LABELS[data.timeline || ""] || data.timeline || "-"}</td>
      </tr>
      ${data.importantFeatures && data.importantFeatures.length > 0 ? `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">중요 기능</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.importantFeatures.map(f => FEATURE_LABELS[f] || f).join(", ")}</td>
      </tr>
      ` : ""}
      ${data.additionalRequests ? `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">추가 요청사항</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; white-space: pre-wrap;">${data.additionalRequests}</td>
      </tr>
      ` : ""}
    `;
  } else {
    detailsHTML = `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 140px; background-color: #f9fafb;">프로젝트 설명</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; white-space: pre-wrap;">${data.projectDescription || "-"}</td>
      </tr>
      ${data.budget ? `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">예산</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.budget}</td>
      </tr>
      ` : ""}
      ${data.timeline ? `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">희망 일정</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.timeline}</td>
      </tr>
      ` : ""}
    `;
  }

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">새로운 상담 문의</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">${trackType} | ${consultationNumber}</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- 접수 정보 -->
      <div style="margin-bottom: 24px; padding: 16px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
        <p style="margin: 0; color: #1e40af; font-size: 14px;">
          <strong>접수 시간:</strong> ${formattedDate}
        </p>
      </div>

      <!-- 연락처 정보 -->
      <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">연락처 정보</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 140px; background-color: #f9fafb;">이름</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.contact.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">연락처</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.contact.phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">이메일</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.contact.email}</td>
        </tr>
        ${data.contact.company ? `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">회사/단체</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${data.contact.company}</td>
        </tr>
        ` : ""}
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb;">연락 희망 시간</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${CONTACT_TIME_LABELS[data.contact.preferredContactTime || ""] || data.contact.preferredContactTime || "미지정"}</td>
        </tr>
      </table>

      <!-- 상담 상세 정보 -->
      <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #2563eb;">상담 상세 정보</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        ${detailsHTML}
      </table>

      <!-- 메타데이터 -->
      ${data.metadata ? `
      <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 8px;">
        <h3 style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase;">접속 정보</h3>
        <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
          ${data.metadata.ipAddress ? `IP: ${data.metadata.ipAddress}<br>` : ""}
          ${data.metadata.referrer ? `유입 경로: ${data.metadata.referrer}<br>` : ""}
          ${data.metadata.userAgent ? `브라우저: ${data.metadata.userAgent.substring(0, 100)}...` : ""}
        </p>
      </div>
      ` : ""}
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">LeoFitTech 상담 문의 알림 시스템</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 상담 번호 생성
export function generateConsultationNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LFT-${year}${month}${day}-${random}`;
}

// 상담 문의 이메일 전송 (Resend)
export async function sendConsultationEmail(
  data: ConsultationEmailData
): Promise<{ success: boolean; consultationNumber: string; error?: string }> {
  const consultationNumber = generateConsultationNumber();
  const notificationEmail = process.env.NOTIFICATION_EMAIL || "ceo@leofittech.com";

  try {
    const resend = getResendClient();
    const trackType = data.type === "guided" ? "가이드 상담" : "자유 상담";

    const { data: result, error } = await resend.emails.send({
      from: "LeoFitTech <onboarding@resend.dev>", // Resend 기본 발신자 (도메인 인증 전)
      to: notificationEmail,
      replyTo: data.contact.email,
      subject: `[LeoFitTech] 새 상담 문의 - ${data.contact.name}님 (${trackType})`,
      html: generateConsultationEmailHTML(data, consultationNumber),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        consultationNumber,
        error: error.message || "이메일 전송에 실패했습니다.",
      };
    }

    console.log("Consultation email sent via Resend:", result?.id);

    return {
      success: true,
      consultationNumber,
    };
  } catch (error) {
    console.error("Failed to send consultation email:", error);
    return {
      success: false,
      consultationNumber,
      error: error instanceof Error ? error.message : "이메일 전송에 실패했습니다.",
    };
  }
}

// 이메일 설정 테스트
export async function testEmailConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    // Resend API 키 유효성 테스트
    await resend.emails.send({
      from: "LeoFitTech <onboarding@resend.dev>",
      to: "test@resend.dev", // Resend 테스트용 이메일
      subject: "Connection Test",
      html: "<p>Test</p>",
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Resend 연결 실패",
    };
  }
}

export default { sendConsultationEmail, testEmailConnection, generateConsultationNumber };
