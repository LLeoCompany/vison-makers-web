/**
 * 토큰 갱신 API
 * POST /api/auth/refresh
 */

import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  getPermissionsByRole,
} from "@/utils/jwt";

// 토큰 갱신 요청 스키마
const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "리프레시 토큰이 필요합니다"),
});

interface RefreshTokenResponse {
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

interface RefreshTokenErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshTokenResponse | RefreshTokenErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "POST 메서드만 허용됩니다.",
      },
    });
  }

  try {
    // 1. 입력 데이터 검증
    const validationResult = RefreshTokenSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "리프레시 토큰이 필요합니다.",
        },
      });
    }

    const { refreshToken } = validationResult.data;

    // 2. 리프레시 토큰 검증
    let decodedRefreshToken;
    try {
      decodedRefreshToken = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message:
            error instanceof Error
              ? error.message
              : "리프레시 토큰이 유효하지 않습니다.",
        },
      });
    }

    // 3. 데이터베이스에서 리프레시 토큰 확인 (실제 구현에서는 필수)
    const isTokenValid = await validateRefreshToken(
      decodedRefreshToken.id,
      refreshToken
    );

    if (!isTokenValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: "REFRESH_TOKEN_REVOKED",
          message: "리프레시 토큰이 취소되었거나 존재하지 않습니다.",
        },
      });
    }

    // 4. 사용자 정보 조회
    const adminUser = await getAdminUserById(decodedRefreshToken.id);

    if (!adminUser || !adminUser.isActive) {
      // 토큰 무효화
      await revokeRefreshToken(decodedRefreshToken.id, refreshToken);

      return res.status(401).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없거나 비활성화된 계정입니다.",
        },
      });
    }

    // 5. 새로운 토큰 생성
    const permissions = getPermissionsByRole(adminUser.role);
    const newAccessToken = generateAccessToken({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      permissions,
    });

    const newRefreshToken = generateRefreshToken(adminUser.id);

    // 6. 기존 리프레시 토큰 무효화 및 새 토큰 저장
    await replaceRefreshToken(
      decodedRefreshToken.id,
      refreshToken,
      newRefreshToken
    );

    // 7. 토큰 갱신 로그 기록
    await logTokenRefresh(
      adminUser.id,
      req.headers["user-agent"] || "",
      getClientIP(req)
    );

    // 8. 성공 응답
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);

    return res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "토큰 갱신 처리 중 오류가 발생했습니다.",
      },
    });
  }
}

// 헬퍼 함수들

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer";
  isActive: boolean;
}

/**
 * 리프레시 토큰 유효성 확인
 */
async function validateRefreshToken(
  userId: string,
  refreshToken: string
): Promise<boolean> {
  // 실제로는 데이터베이스나 Redis에서 확인
  // 현재는 항상 true 반환

  console.log(`Validating refresh token for user ${userId}`);
  return true;

  // 실제 구현 예시:
  /*
  const { data: session, error } = await supabaseAdmin
    .from('user_sessions')
    .select('refresh_token, expires_at')
    .eq('user_id', userId)
    .single();

  if (error || !session) {
    return false;
  }

  // 토큰 매치 및 만료 확인
  const isTokenMatch = session.refresh_token === refreshToken;
  const isNotExpired = new Date(session.expires_at) > new Date();

  return isTokenMatch && isNotExpired;
  */
}

/**
 * ID로 관리자 사용자 조회
 */
async function getAdminUserById(userId: string): Promise<AdminUser | null> {
  // 실제로는 데이터베이스에서 조회
  // 현재는 하드코딩된 테스트 계정 사용

  const testAdmins: AdminUser[] = [
    {
      id: "admin-001",
      email: "admin@LeoFitTech.com",
      name: "시스템 관리자",
      role: "admin",
      isActive: true,
    },
    {
      id: "manager-001",
      email: "manager@LeoFitTech.com",
      name: "상담 매니저",
      role: "manager",
      isActive: true,
    },
  ];

  return testAdmins.find((admin) => admin.id === userId) || null;

  // 실제 구현 예시:
  /*
  const { data: admin, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, email, name, role, is_active')
    .eq('id', userId)
    .single();

  if (error || !admin) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    isActive: admin.is_active,
  };
  */
}

/**
 * 리프레시 토큰 교체
 */
async function replaceRefreshToken(
  userId: string,
  oldRefreshToken: string,
  newRefreshToken: string
): Promise<void> {
  console.log(`Replacing refresh token for user ${userId}`);

  // 실제 구현 예시:
  /*
  await supabaseAdmin
    .from('user_sessions')
    .update({
      refresh_token: newRefreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('refresh_token', oldRefreshToken);
  */
}

/**
 * 리프레시 토큰 무효화
 */
async function revokeRefreshToken(
  userId: string,
  refreshToken: string
): Promise<void> {
  console.log(`Revoking refresh token for user ${userId}`);

  // 실제 구현 예시:
  /*
  await supabaseAdmin
    .from('user_sessions')
    .delete()
    .eq('user_id', userId)
    .eq('refresh_token', refreshToken);
  */
}

/**
 * 토큰 갱신 로그 기록
 */
async function logTokenRefresh(
  userId: string,
  userAgent: string,
  ipAddress: string
): Promise<void> {
  try {
    // 실제로는 consultation_logs 대신 별도의 admin_logs 테이블 사용 권장
    /*
    await supabaseAdmin
      .from('consultation_logs')
      .insert({
        consultation_id: null,
        action: 'token_refresh',
        details: {
          userId,
          userAgent,
          ipAddress,
          timestamp: new Date().toISOString(),
        },
        notes: `토큰 갱신: ${userId}`,
        actor_type: 'admin',
        actor_id: userId,
      });
    */
  } catch (error) {
    console.error("Failed to log token refresh:", error);
  }
}

/**
 * 클라이언트 IP 주소 추출
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"] as string;
  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "unknown";

  return ip;
}
