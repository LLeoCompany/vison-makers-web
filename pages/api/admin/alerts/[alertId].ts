/**
 * 개별 알림 관리 API
 * PUT /api/admin/alerts/[alertId] - 알림 상태 변경 (해결/미해결)
 */

import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest } from "@/middleware/auth";
import { performanceMonitor } from "@/utils/monitoring";
import { extractApiVersion, ResponseTransformer } from "@/utils/apiVersioning";
import { createSuccessResponse } from "@/utils/apiWrapper";
import { withAdminApi } from "@/utils/combinedMiddleware";
import { ValidationError } from "@/utils/errors";
import { z } from "zod";

// 요청 스키마
const AlertUpdateSchema = z.object({
  action: z.enum(["resolve", "unresolve"]),
});

interface AlertUpdateRequest {
  action: "resolve" | "unresolve";
}

interface AlertUpdateResponse {
  success: true;
  data: {
    alertId: string;
    resolved: boolean;
    message: string;
  };
}

async function alertUpdateHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<AlertUpdateResponse>
) {
  const { alertId } = req.query as { alertId: string };

  if (!alertId || typeof alertId !== "string") {
    throw new ValidationError("유효한 알림 ID가 필요합니다.");
  }

  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "PUT 메소드만 지원됩니다.",
      },
    } as any);
  }

  // 요청 데이터 검증
  const validationResult = AlertUpdateSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ValidationError(
      "요청 데이터가 유효하지 않습니다.",
      validationResult.error.errors
    );
  }

  const { action } = validationResult.data;

  // 알림 상태 변경
  const success = performanceMonitor.resolveAlert(alertId);

  if (!success) {
    return res.status(404).json({
      success: false,
      error: {
        code: "ALERT_NOT_FOUND",
        message: "지정된 알림을 찾을 수 없습니다.",
      },
    } as any);
  }

  const responseData = {
    alertId,
    resolved: action === "resolve",
    message:
      action === "resolve"
        ? "알림이 해결됨으로 표시되었습니다."
        : "알림이 미해결로 표시되었습니다.",
  };

  // API 버전에 따른 응답 변환
  const apiVersion = extractApiVersion(req);
  const versionedResponse = ResponseTransformer.transform(
    createSuccessResponse(responseData),
    apiVersion
  );

  return res.status(200).json(versionedResponse);
}

export default withAdminApi(alertUpdateHandler, {
  permission: "writeAccess",
  rateLimit: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1분
  },
  apiConfig: {
    operationName: "alert_update",
    logRequest: true,
    logResponse: true,
  },
});
