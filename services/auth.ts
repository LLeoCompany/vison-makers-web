// Admin Authentication Service
// LeoFitTech - Direct Supabase Communication

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  supabaseAdmin,
  handleSupabaseResponse,
  SupabaseError,
} from "@/lib/supabase";
import type {
  AdminUserRow,
  AdminUserInsert,
  ApiResponse,
  AdminRole,
} from "@/types/database";

// JWT Payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: AdminRole;
  permissions: string[];
  iat?: number;
  exp?: number;
}

// Session data interface
export interface SessionData {
  user: AdminUserRow;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "default-auth-service-secret-key-LeoFitTech-2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// Type-safe JWT options
const getExpiresIn = (value: string): string | number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? value : parsed;
};

// 개발 환경에서 기본값 사용 시 경고
if (process.env.NODE_ENV === "development" && !process.env.JWT_SECRET) {
  console.warn(
    "⚠️  JWT_SECRET not configured for auth service. Using default development secret."
  );
}

// 프로덕션 환경에서는 반드시 환경변수 필요
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required for production");
}

// Generate JWT tokens
export function generateAccessToken(
  payload: Omit<JWTPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    issuer: "LeoFitTech-api",
    audience: "LeoFitTech-admin",
  });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    issuer: "LeoFitTech-api",
    audience: "LeoFitTech-admin",
  });
}

// Verify JWT tokens
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "LeoFitTech-api",
      audience: "LeoFitTech-admin",
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("ACCESS_TOKEN_EXPIRED");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("INVALID_ACCESS_TOKEN");
    }
    throw new Error("TOKEN_VERIFICATION_FAILED");
  }
}

export function verifyRefreshToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "LeoFitTech-api",
      audience: "LeoFitTech-admin",
    }) as any;

    if (decoded.type !== "refresh") {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    return { userId: decoded.userId };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
    throw new Error("TOKEN_VERIFICATION_FAILED");
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Admin login
export async function loginAdmin(
  credentials: LoginCredentials,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
  }
): Promise<ApiResponse<SessionData>> {
  try {
    // Find user by email
    const userResponse = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", credentials.email)
      .eq("is_active", true)
      .single();

    if (userResponse.error) {
      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        },
      };
    }

    const user = userResponse.data;

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return {
        success: false,
        error: {
          code: "ACCOUNT_LOCKED",
          message: "계정이 일시적으로 잠겨있습니다. 나중에 다시 시도해주세요.",
        },
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      credentials.password,
      user.password_hash
    );

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (user.failed_login_attempts || 0) + 1;
      const maxAttempts = 5;
      const lockDuration = 30 * 60 * 1000; // 30 minutes

      const updateData: any = {
        failed_login_attempts: newFailedAttempts,
        updated_at: new Date().toISOString(),
      };

      if (newFailedAttempts >= maxAttempts) {
        updateData.locked_until = new Date(
          Date.now() + lockDuration
        ).toISOString();
      }

      await supabaseAdmin
        .from("admin_users")
        .update(updateData)
        .eq("id", user.id);

      return {
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        },
      };
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });

    const refreshToken = generateRefreshToken(user.id);

    // Calculate expiration times
    const accessTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const refreshTokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Hash tokens for storage
    const accessTokenHash = await hashPassword(accessToken);
    const refreshTokenHash = await hashPassword(refreshToken);

    // Create session record
    const sessionResponse = await supabaseAdmin
      .from("user_sessions")
      .insert({
        user_id: user.id,
        access_token_hash: accessTokenHash,
        refresh_token_hash: refreshTokenHash,
        user_agent: metadata?.userAgent || null,
        ip_address: metadata?.ipAddress || "127.0.0.1",
        device_info: {},
        expires_at: refreshTokenExp.toISOString(),
      })
      .select()
      .single();

    handleSupabaseResponse(sessionResponse);

    // Update user login info
    await supabaseAdmin
      .from("admin_users")
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString(),
        last_login_ip: metadata?.ipAddress || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
        expiresAt: accessTokenExp.toISOString(),
      },
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "LOGIN_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "로그인 중 오류가 발생했습니다.",
      },
    };
  }
}

// Refresh access token
export async function refreshAccessToken(
  refreshToken: string
): Promise<ApiResponse<{ accessToken: string; expiresAt: string }>> {
  try {
    // Verify refresh token
    const { userId } = verifyRefreshToken(refreshToken);

    // Find active session
    const sessionResponse = await supabaseAdmin
      .from("user_sessions")
      .select("*, admin_users(*)")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single();

    if (sessionResponse.error) {
      return {
        success: false,
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "유효하지 않은 리프레시 토큰입니다.",
        },
      };
    }

    const session = sessionResponse.data as any;
    const user = session.admin_users;

    // Verify the refresh token hash
    const isRefreshTokenValid = await verifyPassword(
      refreshToken,
      session.refresh_token_hash
    );

    if (!isRefreshTokenValid) {
      return {
        success: false,
        error: {
          code: "INVALID_REFRESH_TOKEN",
          message: "유효하지 않은 리프레시 토큰입니다.",
        },
      };
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return {
        success: false,
        error: {
          code: "REFRESH_TOKEN_EXPIRED",
          message: "리프레시 토큰이 만료되었습니다.",
        },
      };
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });

    const accessTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const accessTokenHash = await hashPassword(newAccessToken);

    // Update session with new access token
    await supabaseAdmin
      .from("user_sessions")
      .update({
        access_token_hash: accessTokenHash,
        last_accessed_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    return {
      success: true,
      data: {
        accessToken: newAccessToken,
        expiresAt: accessTokenExp.toISOString(),
      },
    };
  } catch (error) {
    console.error("Token refresh error:", error);

    return {
      success: false,
      error: {
        code: "TOKEN_REFRESH_ERROR",
        message: "토큰 갱신 중 오류가 발생했습니다.",
      },
    };
  }
}

// Logout
export async function logoutAdmin(
  userId: string,
  sessionId?: string
): Promise<ApiResponse<void>> {
  try {
    let query = supabaseAdmin
      .from("user_sessions")
      .update({ is_active: false })
      .eq("user_id", userId);

    if (sessionId) {
      query = query.eq("id", sessionId);
    }

    const response = await query;
    handleSupabaseResponse(response);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Logout error:", error);

    return {
      success: false,
      error: {
        code: "LOGOUT_ERROR",
        message: "로그아웃 중 오류가 발생했습니다.",
      },
    };
  }
}

// Get user by ID
export async function getUserById(
  userId: string
): Promise<ApiResponse<AdminUserRow>> {
  try {
    const response = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("id", userId)
      .eq("is_active", true)
      .single();

    const user = handleSupabaseResponse(response);

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Get user error:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "USER_NOT_FOUND",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "사용자 정보를 가져올 수 없습니다.",
      },
    };
  }
}

// Check if user has permission
export function hasPermission(user: AdminUserRow, permission: string): boolean {
  // Admin role has all permissions
  if (user.role === "admin") {
    return true;
  }

  // Check specific permission
  return user.permissions.includes(permission);
}

// Check if user has any of the specified roles
export function hasRole(user: AdminUserRow, roles: AdminRole[]): boolean {
  return roles.includes(user.role);
}

// Validate password strength
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("비밀번호는 최소 8자 이상이어야 합니다.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("비밀번호에는 대문자가 포함되어야 합니다.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("비밀번호에는 소문자가 포함되어야 합니다.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("비밀번호에는 숫자가 포함되어야 합니다.");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("비밀번호에는 특수문자가 포함되어야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Create new admin user (Admin only)
export async function createAdminUser(
  userData: Omit<
    AdminUserInsert,
    "id" | "password_hash" | "created_at" | "updated_at"
  > & {
    password: string;
  },
  createdBy: string
): Promise<ApiResponse<AdminUserRow>> {
  try {
    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: {
          code: "INVALID_PASSWORD",
          message: passwordValidation.errors.join(" "),
        },
      };
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user record
    const userResponse = await supabaseAdmin
      .from("admin_users")
      .insert({
        ...userData,
        password_hash: passwordHash,
        password_changed_at: new Date().toISOString(),
        created_by: createdBy,
      })
      .select()
      .single();

    const user = handleSupabaseResponse(userResponse);

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Create admin user error:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "USER_CREATE_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "사용자 생성 중 오류가 발생했습니다.",
      },
    };
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await supabaseAdmin
      .from("user_sessions")
      .update({ is_active: false })
      .lt("expires_at", new Date().toISOString());
  } catch (error) {
    console.error("Session cleanup error:", error);
  }
}
