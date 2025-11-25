/**
 * 관리자 로그인 API
 * POST /api/auth/login
 */

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateAccessToken, generateRefreshToken, getPermissionsByRole } from '@/utils/jwt';
import { supabaseAdmin } from '@/lib/supabase';

// 로그인 요청 스키마
const LoginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
  rememberMe: z.boolean().optional(),
});

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: true;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      permissions: string[];
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    };
  };
}

interface LoginErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse | LoginErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'POST 메서드만 허용됩니다.',
      },
    });
  }

  try {
    // 1. 입력 데이터 검증
    const validationResult = LoginSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력 데이터가 유효하지 않습니다.',
          details: validationResult.error.errors,
        },
      });
    }

    const { email, password, rememberMe = false } = validationResult.data;

    // 2. 사용자 조회 (실제로는 관리자 테이블에서 조회해야 함)
    // 현재는 하드코딩된 관리자 계정 사용
    const adminUser = await getAdminUser(email);

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        },
      });
    }

    // 3. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      // 로그인 실패 로그 기록
      await logLoginAttempt(email, false, req.headers['user-agent'] || '', getClientIP(req));

      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        },
      });
    }

    // 4. 사용자 권한 확인
    if (!adminUser.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: '비활성화된 계정입니다. 관리자에게 문의하세요.',
        },
      });
    }

    // 5. JWT 토큰 생성
    const permissions = getPermissionsByRole(adminUser.role);
    const accessToken = generateAccessToken({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      permissions,
    });

    const refreshToken = generateRefreshToken(adminUser.id);

    // 6. 리프레시 토큰을 데이터베이스에 저장 (또는 Redis)
    await storeRefreshToken(adminUser.id, refreshToken);

    // 7. 로그인 성공 로그 기록
    await logLoginAttempt(email, true, req.headers['user-agent'] || '', getClientIP(req));

    // 8. 마지막 로그인 시간 업데이트
    await updateLastLogin(adminUser.id);

    // 9. 성공 응답
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          permissions,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        },
      },
    });

  } catch (error) {
    console.error('Login API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '로그인 처리 중 오류가 발생했습니다.',
      },
    });
  }
}

// 헬퍼 함수들

interface AdminUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  isActive: boolean;
}

/**
 * 관리자 사용자 조회 (실제로는 데이터베이스 테이블에서 조회)
 */
async function getAdminUser(email: string): Promise<AdminUser | null> {
  // 실제 구현에서는 admin_users 테이블에서 조회
  // 현재는 하드코딩된 테스트 계정 사용

  const testAdmins: AdminUser[] = [
    {
      id: 'admin-001',
      email: 'admin@visionmakers.com',
      password: await bcrypt.hash('admin123!', 12), // 실제로는 미리 해시된 값 저장
      name: '시스템 관리자',
      role: 'admin',
      isActive: true,
    },
    {
      id: 'manager-001',
      email: 'manager@visionmakers.com',
      password: await bcrypt.hash('manager123!', 12),
      name: '상담 매니저',
      role: 'manager',
      isActive: true,
    },
  ];

  return testAdmins.find(admin => admin.email === email) || null;

  // 실제 구현 예시:
  /*
  const { data: admin, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (error || !admin) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    password: admin.password_hash,
    name: admin.name,
    role: admin.role,
    isActive: admin.is_active,
  };
  */
}

/**
 * 리프레시 토큰 저장
 */
async function storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
  // 실제로는 Redis나 데이터베이스에 저장
  // 현재는 로그만 출력

  console.log(`Storing refresh token for user ${userId}`);

  // 실제 구현 예시:
  /*
  await supabaseAdmin
    .from('user_sessions')
    .upsert({
      user_id: userId,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일
      updated_at: new Date().toISOString(),
    });
  */
}

/**
 * 로그인 시도 로그 기록
 */
async function logLoginAttempt(
  email: string,
  success: boolean,
  userAgent: string,
  ipAddress: string
): Promise<void> {
  // Note: consultation_logs requires consultation_id, so admin login logs
  // are not recorded there. Consider creating a separate admin_logs table.
  console.log(`Admin login ${success ? 'success' : 'failed'}: ${email} from ${ipAddress}`);
}

/**
 * 마지막 로그인 시간 업데이트
 */
async function updateLastLogin(userId: string): Promise<void> {
  // 실제 구현에서는 admin_users 테이블 업데이트
  console.log(`Updating last login for user ${userId}`);

  /*
  await supabaseAdmin
    .from('admin_users')
    .update({
      last_login_at: new Date().toISOString(),
      login_count: supabaseAdmin.rpc('increment', { column: 'login_count' })
    })
    .eq('id', userId);
  */
}

/**
 * 클라이언트 IP 주소 추출
 */
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  return ip;
}