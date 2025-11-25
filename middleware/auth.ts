/**
 * 인증/인가 미들웨어
 * LeoFitTech API 보안 시스템
 */

import { NextApiRequest, NextApiResponse } from "next";
import {
  verifyAccessToken,
  extractTokenFromHeader,
  hasPermission,
  JWTPayload,
} from "@/utils/jwt";

// 확장된 요청 타입 정의
export interface AuthenticatedRequest extends NextApiRequest {
  user?: JWTPayload;
}

// API 키 검증용 인터페이스
export interface ApiKeyRequest extends NextApiRequest {
  apiKeyValidated?: boolean;
}

/**
 * JWT 토큰 기반 인증 미들웨어
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: NextApiResponse
): boolean {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          code: "MISSING_TOKEN",
          message: "인증 토큰이 필요합니다.",
        },
      });
      return false;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    return true;
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message:
          error instanceof Error ? error.message : "토큰 검증에 실패했습니다.",
      },
    });
    return false;
  }
}

/**
 * 관리자 권한 확인 미들웨어
 */
export function requireAdminRole(
  req: AuthenticatedRequest,
  res: NextApiResponse
): boolean {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "인증이 필요합니다.",
      },
    });
    return false;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({
      success: false,
      error: {
        code: "INSUFFICIENT_PRIVILEGES",
        message: "관리자 권한이 필요합니다.",
      },
    });
    return false;
  }

  return true;
}

/**
 * 특정 권한 확인 미들웨어
 */
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: NextApiResponse): boolean => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: "AUTHENTICATION_REQUIRED",
          message: "인증이 필요합니다.",
        },
      });
      return false;
    }

    if (!hasPermission(req.user.permissions, permission)) {
      res.status(403).json({
        success: false,
        error: {
          code: "INSUFFICIENT_PRIVILEGES",
          message: `${permission} 권한이 필요합니다.`,
        },
      });
      return false;
    }

    return true;
  };
}

/**
 * API 키 검증 미들웨어
 */
export function verifyApiKey(
  req: ApiKeyRequest,
  res: NextApiResponse
): boolean {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({
      success: false,
      error: {
        code: "MISSING_API_KEY",
        message: "API 키가 필요합니다.",
      },
    });
    return false;
  }

  const validKeys = process.env.VALID_API_KEYS?.split(",") || [];

  if (!validKeys.includes(apiKey)) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_API_KEY",
        message: "유효하지 않은 API 키입니다.",
      },
    });
    return false;
  }

  req.apiKeyValidated = true;
  return true;
}

/**
 * 선택적 인증 미들웨어 (토큰이 있으면 검증, 없어도 통과)
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse
): boolean {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  // 토큰이 없으면 그냥 통과
  if (!token) {
    return true;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return true;
  } catch (error) {
    // 토큰이 잘못된 경우에만 에러 반환
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message:
          error instanceof Error ? error.message : "토큰 검증에 실패했습니다.",
      },
    });
    return false;
  }
}

/**
 * 미들웨어 체인 실행 헬퍼
 */
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  middlewares: Array<(req: any, res: NextApiResponse) => boolean>
): boolean {
  for (const middleware of middlewares) {
    if (!middleware(req, res)) {
      return false;
    }
  }
  return true;
}

/**
 * HOC로 미들웨어를 래핑하는 헬퍼
 */
export function withAuth(
  handler: (
    req: AuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void> | void,
  middlewares: Array<
    (req: AuthenticatedRequest, res: NextApiResponse) => boolean
  > = [authenticateToken]
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    // 미들웨어 실행
    const isValid = runMiddleware(req, res, middlewares);

    if (!isValid) {
      return; // 미들웨어에서 이미 응답을 보냈음
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.error("Handler error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "서버 내부 오류가 발생했습니다.",
          },
        });
      }
    }
  };
}

/**
 * 미리 정의된 미들웨어 조합
 */
export const authMiddlewares = {
  // 관리자만 접근 가능
  adminOnly: [authenticateToken, requireAdminRole],

  // 읽기 권한 필요
  readAccess: [authenticateToken, requirePermission("consultation:read")],

  // 쓰기 권한 필요
  writeAccess: [authenticateToken, requirePermission("consultation:write")],

  // 삭제 권한 필요
  deleteAccess: [authenticateToken, requirePermission("consultation:delete")],

  // 통계 읽기 권한
  statsAccess: [authenticateToken, requirePermission("stats:read")],

  // API 키만 검증 (공개 API용)
  apiKeyOnly: [verifyApiKey],

  // 토큰 또는 API 키 (둘 중 하나만 있으면 됨)
  tokenOrApiKey: [
    (req: any, res: NextApiResponse) => {
      // API 키 먼저 체크
      if (req.headers["x-api-key"]) {
        return verifyApiKey(req, res);
      }

      // API 키가 없으면 토큰 체크
      return authenticateToken(req, res);
    },
  ],
};

/**
 * 개발 환경에서 인증을 우회하는 미들웨어
 */
export function bypassAuthInDev(
  req: AuthenticatedRequest,
  res: NextApiResponse
): boolean {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.BYPASS_AUTH === "true"
  ) {
    // 개발 환경에서 테스트용 사용자 설정
    req.user = {
      id: "dev-admin-001",
      email: "dev@LeoFitTech.com",
      name: "개발자",
      role: "admin",
      permissions: ["admin"],
    };
    return true;
  }

  return authenticateToken(req, res);
}
