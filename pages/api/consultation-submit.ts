/**
 * 상담 신청 API 엔드포인트
 * POST /api/consultation-submit
 */

import { NextApiRequest, NextApiResponse } from "next";
import {
  ConsultationRequestSchema,
  sanitizeInput,
} from "@/schemas/consultation";
import { supabaseAdmin } from "@/lib/supabase";
import {
  generateConsultationNumber,
  getClientIP,
  parseUserAgent,
  extractUTMParams,
  getEstimatedProcessingTime,
} from "@/utils/consultation";
import { ConsultationRequest, ConsultationResponse } from "@/types/database";
import { withPost, createSuccessResponse } from "@/utils/apiWrapper";
import { ValidationError, DatabaseError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import { withRateLimit, rateLimitConfigs } from "@/utils/rateLimiter";
import {
  withApiVersion,
  ResponseTransformer,
  extractApiVersion,
} from "@/utils/apiVersioning";
import { triggerNewConsultationNotification } from "@/utils/adminNotificationTrigger";

async function consultationSubmitHandler(
  req: NextApiRequest,
  res: NextApiResponse<ConsultationResponse>
): Promise<void> {
  const body = req.body as ConsultationRequest;
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // 1. 요청 데이터 검증
  const validationResult = ConsultationRequestSchema.safeParse(req.body);

  if (!validationResult.success) {
    throw new ValidationError(
      "입력 데이터가 유효하지 않습니다.",
      validationResult.error.errors
    );
  }

  const consultationData = validationResult.data;

  // 2. 메타데이터 수집
  const userAgent = req.headers["user-agent"] || "";
  const ipAddress = getClientIP(req);
  const referrer = (req.headers.referer || req.headers.referrer || "") as string;
  const utmParams = extractUTMParams(referrer);

  // 3. 상담 번호 생성
  const consultationNumber = generateConsultationNumber();

  // 4. 메인 상담 레코드 생성
  const { data: consultation, error: consultationError } = await supabaseAdmin
    .from("consultations")
    .insert({
      consultation_number: consultationNumber,
      type: consultationData.type,
      status: "pending",
      priority: "normal",
      contact_name: sanitizeInput(consultationData.contact.name),
      contact_phone: sanitizeInput(consultationData.contact.phone),
      contact_email: sanitizeInput(consultationData.contact.email),
      contact_company: consultationData.contact.company
        ? sanitizeInput(consultationData.contact.company)
        : null,
      preferred_contact_time:
        consultationData.contact.preferredContactTime || null,
      user_agent: userAgent,
      ip_address: ipAddress,
      referrer_url: referrer,
      utm_source: utmParams.source || null,
      utm_medium: utmParams.medium || null,
      utm_campaign: utmParams.campaign || null,
    })
    .select()
    .single();

  if (consultationError) {
    logger.error("Consultation insert failed", {
      error: {
        name: consultationError.name || "SupabaseError",
        message: consultationError.message,
      },
      action: "create_consultation",
      metadata: {
        consultationData: {
          type: consultationData.type,
          email: consultationData.contact.email,
        },
      },
    });
    throw new DatabaseError(
      "상담 신청 처리 중 오류가 발생했습니다.",
      consultationError
    );
  }

  // 5. 타입별 세부 정보 저장
  if (consultationData.type === "guided") {
    const { error: guidedError } = await supabaseAdmin
      .from("guided_consultations")
      .insert({
        consultation_id: consultation.id,
        service_type: consultationData.serviceType,
        project_size: consultationData.projectSize,
        budget: consultationData.budget,
        timeline: consultationData.timeline,
        important_features: consultationData.importantFeatures,
        additional_requests: consultationData.additionalRequests
          ? sanitizeInput(consultationData.additionalRequests)
          : null,
      });

    if (guidedError) {
      console.error("Guided consultation insert error:", guidedError);
      // 메인 레코드도 삭제
      await supabaseAdmin
        .from("consultations")
        .delete()
        .eq("id", consultation.id);

      throw new DatabaseError(
        "가이드 상담 정보 저장 중 오류가 발생했습니다.",
        guidedError
      );
    }
  } else if (consultationData.type === "free") {
    const { error: freeError } = await supabaseAdmin
      .from("free_consultations")
      .insert({
        consultation_id: consultation.id,
        project_description: sanitizeInput(consultationData.projectDescription),
        budget_range: consultationData.budget
          ? sanitizeInput(consultationData.budget)
          : null,
        timeline_preference: consultationData.timeline
          ? sanitizeInput(consultationData.timeline)
          : null,
      });

    if (freeError) {
      console.error("Free consultation insert error:", freeError);
      // 메인 레코드도 삭제
      await supabaseAdmin
        .from("consultations")
        .delete()
        .eq("id", consultation.id);

      throw new DatabaseError(
        "자유 상담 정보 저장 중 오류가 발생했습니다.",
        freeError
      );
    }
  }

  // 6. 로그 기록
  await supabaseAdmin.from("consultation_logs").insert({
    consultation_id: consultation.id,
    action: "created",
    details: {
      type: consultationData.type,
      ip_address: ipAddress,
      user_agent: parseUserAgent(userAgent),
      utm_params: utmParams,
    },
    actor_type: "system",
  });

  // 7. 예상 연락 시간 계산
  const estimatedContactTime = getEstimatedProcessingTime(
    consultationData.type
  );

  // 8. 관리자 알림 트리거
  try {
    await triggerNewConsultationNotification(consultation.id, "normal");
  } catch (notificationError) {
    // 알림 실패는 메인 프로세스에 영향을 주지 않도록 처리
    console.error("Failed to trigger admin notification:", notificationError);
  }

  // 9. 성공 로깅
  logger.businessEvent("consultation_created", "consultation", {
    metadata: {
      consultationId: consultation.id,
      consultationNumber: consultation.consultation_number,
      type: consultationData.type,
    },
  });

  // 10. 버전별 응답 데이터 구성
  const responseData = {
    consultationId: consultation.id,
    consultationNumber: consultation.consultation_number,
    estimatedContactTime,
  };

  // 11. API 버전에 따른 응답 변환
  const apiVersion = extractApiVersion(req);
  const versionedResponse = ResponseTransformer.transform(
    createSuccessResponse(responseData),
    apiVersion
  );

  res.status(201).json(versionedResponse);
}

// 통합 미들웨어로 레이트 리미팅, 에러 처리, 로깅, 버전 관리 자동화
import { withPublicApi, presetConfigs } from "@/utils/combinedMiddleware";

export default withPublicApi(
  consultationSubmitHandler,
  presetConfigs.consultationSubmit
);
