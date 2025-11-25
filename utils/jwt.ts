/**
 * JWT 토큰 생성 및 검증 유틸리티
 * LeoFitTech 관리자 인증 시스템용
 */

import jwt from "jsonwebtoken";

// JWT 페이로드 타입 정의
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer";
  permissions: string[];
  iat?: number;
  exp?: number;
}

// 환경변수 검증
const JWT_SECRET =
  process.env.JWT_SECRET || "default-development-secret-key-LeoFitTech-2024";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "default-development-refresh-secret-key-LeoFitTech-2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// 개발 환경에서 기본값 사용 시 경고
if (
  process.env.NODE_ENV === "development" &&
  (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
) {
  console.warn(
    "⚠️  JWT secrets not configured in environment variables. Using default development secrets."
  );
  console.warn(
    "   For production, please set JWT_SECRET and JWT_REFRESH_SECRET environment variables."
  );
}

// 프로덕션 환경에서는 반드시 환경변수 필요
if (
  process.env.NODE_ENV === "production" &&
  (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
) {
  throw new Error(
    "JWT secrets must be defined in environment variables for production"
  );
}

/**
 * Access Token 생성
 */
export function generateAccessToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    issuer: "LeoFitTech-api",
    audience: "LeoFitTech-admin",
  });
}

/**
 * Refresh Token 생성
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId, type: "refresh" }, JWT_REFRESH_SECRET!, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    issuer: "LeoFitTech-api",
    audience: "LeoFitTech-admin",
  });
}

/**
 * Access Token 검증
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!, {
      issuer: "LeoFitTech-api",
      audience: "LeoFitTech-admin",
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("유효하지 않은 토큰입니다");
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error("토큰이 만료되었습니다");
    } else {
      throw new Error("토큰 검증 중 오류가 발생했습니다");
    }
  }
}

/**
 * Refresh Token 검증
 */
export function verifyRefreshToken(token: string): {
  id: string;
  type: string;
} {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET!, {
      issuer: "LeoFitTech-api",
      audience: "LeoFitTech-admin",
    }) as any;

    if (decoded.type !== "refresh") {
      throw new Error("올바른 리프레시 토큰이 아닙니다");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("유효하지 않은 리프레시 토큰입니다");
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error("리프레시 토큰이 만료되었습니다");
    } else {
      throw new Error("리프레시 토큰 검증 중 오류가 발생했습니다");
    }
  }
}

/**
 * 토큰에서 Bearer 접두사 제거
 */
export function extractTokenFromHeader(
  authHeader: string | undefined
): string | null {
  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7); // 'Bearer ' 제거
}

/**
 * 권한 확인 헬퍼
 */
export function hasPermission(
  userPermissions: string[],
  requiredPermission: string
): boolean {
  // 'admin' 권한은 모든 권한을 포함
  if (userPermissions.includes("admin")) {
    return true;
  }

  return userPermissions.includes(requiredPermission);
}

/**
 * 역할별 기본 권한 정의
 */
export const DEFAULT_PERMISSIONS = {
  admin: [
    "admin",
    "consultation:read",
    "consultation:write",
    "consultation:delete",
    "stats:read",
    "users:read",
    "users:write",
    "users:delete",
    "logs:read",
  ],
  manager: [
    "consultation:read",
    "consultation:write",
    "stats:read",
    "logs:read",
  ],
  viewer: ["consultation:read", "stats:read"],
} as const;

/**
 * 역할에 따른 권한 가져오기
 */
export function getPermissionsByRole(
  role: "admin" | "manager" | "viewer"
): string[] {
  return [...DEFAULT_PERMISSIONS[role]];
}

/**
 * 토큰 만료 시간 확인
 */
export function isTokenExpiringSoon(
  token: string,
  thresholdMinutes: number = 5
): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded?.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const threshold = thresholdMinutes * 60;

    return decoded.exp - now < threshold;
  } catch {
    return true; // 디코딩 실패 시 만료로 간주
  }
}

/**
 * 개발 모드에서 사용할 테스트 토큰 생성
 */
export function generateTestToken(): string {
  if (process.env.NODE_ENV === "production") {
    throw new Error("테스트 토큰은 개발 모드에서만 사용할 수 있습니다");
  }

  return generateAccessToken({
    id: "test-admin-001",
    email: "admin@LeoFitTech.com",
    name: "테스트 관리자",
    role: "admin",
    permissions: getPermissionsByRole("admin"),
  });
}
