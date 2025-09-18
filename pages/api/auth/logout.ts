/**
 * 관리자 로그아웃 API
 * POST /api/auth/logout
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { withAuth, AuthenticatedRequest } from '@/middleware/auth';

// 로그아웃 요청 스키마
const LogoutSchema = z.object({
  refreshToken: z.string().optional(),
  allDevices: z.boolean().optional().default(false),
});

interface LogoutResponse {
  success: true;
  message: string;
}

interface LogoutErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

async function logoutHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<LogoutResponse | LogoutErrorResponse>
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
    const validationResult = LogoutSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '요청 데이터가 유효하지 않습니다.',
        },
      });
    }

    const { refreshToken, allDevices } = validationResult.data;
    const userId = req.user!.id; // withAuth에서 보장됨

    // 2. 리프레시 토큰 무효화
    if (allDevices) {
      // 모든 디바이스에서 로그아웃 (모든 리프레시 토큰 삭제)
      await revokeAllRefreshTokens(userId);
    } else if (refreshToken) {
      // 특정 리프레시 토큰만 무효화
      await revokeRefreshToken(userId, refreshToken);
    } else {
      // 현재 세션만 무효화 (리프레시 토큰이 없어도 처리)
      await revokeCurrentSession(userId);
    }

    // 3. 로그아웃 로그 기록
    await logLogoutEvent(
      userId,
      allDevices,
      req.headers['user-agent'] || '',
      getClientIP(req)
    );

    // 4. 성공 응답
    return res.status(200).json({
      success: true,
      message: allDevices
        ? '모든 디바이스에서 로그아웃되었습니다.'
        : '로그아웃되었습니다.',
    });

  } catch (error) {
    console.error('Logout API error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '로그아웃 처리 중 오류가 발생했습니다.',
      },
    });
  }
}

// withAuth 미들웨어 적용
export default withAuth(logoutHandler);

// 헬퍼 함수들

/**
 * 특정 리프레시 토큰 무효화
 */
async function revokeRefreshToken(userId: string, refreshToken: string): Promise<void> {
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
 * 사용자의 모든 리프레시 토큰 무효화
 */
async function revokeAllRefreshTokens(userId: string): Promise<void> {
  console.log(`Revoking all refresh tokens for user ${userId}`);

  // 실제 구현 예시:
  /*
  await supabaseAdmin
    .from('user_sessions')
    .delete()
    .eq('user_id', userId);
  */
}

/**
 * 현재 세션 무효화 (리프레시 토큰이 없는 경우)
 */
async function revokeCurrentSession(userId: string): Promise<void> {
  console.log(`Revoking current session for user ${userId}`);

  // Access Token은 상태를 저장하지 않으므로 블랙리스트에 추가
  // 또는 토큰의 만료 시간을 단축하는 방법 사용

  // 실제 구현 예시 (블랙리스트 방식):
  /*
  await supabaseAdmin
    .from('token_blacklist')
    .insert({
      user_id: userId,
      blacklisted_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24시간 후 자동 삭제
    });
  */
}

/**
 * 로그아웃 이벤트 로그 기록
 */
async function logLogoutEvent(
  userId: string,
  allDevices: boolean,
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
        action: allDevices ? 'admin_logout_all_devices' : 'admin_logout',
        details: {
          userId,
          allDevices,
          userAgent,
          ipAddress,
          timestamp: new Date().toISOString(),
        },
        notes: allDevices
          ? `관리자가 모든 디바이스에서 로그아웃: ${userId}`
          : `관리자 로그아웃: ${userId}`,
        actor_type: 'admin',
        actor_id: userId,
      });
    */
  } catch (error) {
    console.error('Failed to log logout event:', error);
  }
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