/**
 * 간단한 상담 신청 API
 * POST /api/consultation-simple
 * Resend를 통해 관리자/고객에게 이메일 발송
 */

import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 회사 타입 라벨
const COMPANY_TYPE_LABELS: Record<string, string> = {
  startup: "스타트업",
  sme: "중소기업",
  enterprise: "대기업",
  agency: "에이전시",
  individual: "개인사업자",
  public: "공공기관",
  other: "기타",
};

// 상담 번호 생성
function generateConsultationNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VM-${year}${month}${day}-${random}`;
}

// XSS 방지
function sanitize(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

// 관리자 알림 이메일 HTML
function generateAdminEmailHTML(data: {
  consultationNumber: string;
  companyName: string;
  phone: string;
  email: string;
  companyType: string;
  submittedAt: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">새로운 상담 신청</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">${data.consultationNumber}</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- 접수 시간 -->
      <div style="margin-bottom: 20px; padding: 12px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10B981;">
        <p style="margin: 0; color: #047857; font-size: 13px;">
          <strong>접수 시간:</strong> ${data.submittedAt}
        </p>
      </div>

      <!-- 신청 정보 -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 100px; background-color: #f9fafb; color: #374151;">회사명</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.companyName}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">전화번호</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.phone}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; background-color: #f9fafb; color: #374151;">이메일</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${data.email}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-weight: 600; background-color: #f9fafb; color: #374151;">회사 타입</td>
          <td style="padding: 12px; color: #1f2937;">${COMPANY_TYPE_LABELS[data.companyType] || data.companyType}</td>
        </tr>
      </table>

      <!-- 액션 버튼 -->
      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${data.email}" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          고객에게 회신하기
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px; color: #9ca3af; font-size: 11px;">
      <p style="margin: 0;">Vision-Makers 상담 알림 시스템</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// 고객 확인 이메일 HTML
function generateCustomerEmailHTML(data: {
  consultationNumber: string;
  companyName: string;
  submittedAt: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 700;">상담 신청이 접수되었습니다</h1>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
        안녕하세요, <strong>${data.companyName}</strong> 담당자님.
      </p>
      <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
        Vision-Makers에 상담을 신청해 주셔서 감사합니다.<br>
        접수번호 <strong>${data.consultationNumber}</strong>으로 신청이 완료되었습니다.
      </p>

      <div style="padding: 16px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10B981; margin-bottom: 20px;">
        <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
          영업일 기준 <strong>24시간 이내</strong>에 전문 컨설턴트가 연락드리겠습니다.
        </p>
      </div>

      <div style="padding: 12px; background-color: #f9fafb; border-radius: 8px;">
        <p style="margin: 0; color: #6b7280; font-size: 13px;">
          <strong>접수번호:</strong> ${data.consultationNumber}<br>
          <strong>접수시간:</strong> ${data.submittedAt}
        </p>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin: 20px 0 0 0;">
        급한 문의는 <a href="tel:010-9915-4724" style="color: #10B981;">010-9915-4724</a>로 연락주세요.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px; color: #9ca3af; font-size: 11px;">
      <p style="margin: 0;">Vision-Makers</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: { code: "METHOD_NOT_ALLOWED", message: "POST 메서드만 허용됩니다." },
    });
  }

  try {
    const { companyName, phone, email, companyType } = req.body;

    // 유효성 검사
    if (!companyName || !phone || !email || !companyType) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "모든 필드를 입력해주세요." },
      });
    }

    // 이메일 형식 검사
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "올바른 이메일을 입력해주세요." },
      });
    }

    // 전화번호 형식 검사
    if (!/^01[016789]\d{7,8}$/.test(phone.replace(/-/g, ""))) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "올바른 전화번호를 입력해주세요." },
      });
    }

    const consultationNumber = generateConsultationNumber();
    const submittedAt = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const fromEmail = process.env.FROM_EMAIL || "Vision-Makers <onboarding@resend.dev>";
    const adminEmail = process.env.ADMIN_EMAIL || "ceo@leofittech.com";

    // 관리자 알림 이메일 발송
    if (process.env.ENABLE_ADMIN_EMAIL !== "false") {
      await resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        replyTo: email,
        subject: `[상담신청] ${sanitize(companyName)} - ${COMPANY_TYPE_LABELS[companyType] || companyType}`,
        html: generateAdminEmailHTML({
          consultationNumber,
          companyName: sanitize(companyName),
          phone: sanitize(phone),
          email: sanitize(email),
          companyType,
          submittedAt,
        }),
      });
    }

    // 고객 확인 이메일 발송
    if (process.env.ENABLE_CUSTOMER_EMAIL === "true") {
      await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: `[Vision-Makers] 상담 신청이 접수되었습니다 (${consultationNumber})`,
        html: generateCustomerEmailHTML({
          consultationNumber,
          companyName: sanitize(companyName),
          submittedAt,
        }),
      });
    }

    console.log(`Consultation submitted: ${consultationNumber}`);

    return res.status(201).json({
      success: true,
      data: {
        consultationNumber,
        message: "상담 신청이 완료되었습니다.",
      },
    });
  } catch (error) {
    console.error("Consultation API error:", error);
    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
    });
  }
}
