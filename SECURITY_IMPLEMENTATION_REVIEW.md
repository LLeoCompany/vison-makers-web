# 🔒 Security Implementation Review

## 📊 보안 구현 현황 분석

### ✅ Authentication & Authorization

**현재 인증/인가 시스템:**

```typescript
// ✅ 강력한 JWT 기반 인증 시스템 - utils/jwt.ts
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer";
  permissions: string[];
  iat?: number;
  exp?: number;
}

// ✅ 이중 시크릿 키 사용 (Access + Refresh)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ✅ 역할 기반 권한 시스템 (RBAC)
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

// ✅ 세분화된 권한 검증 - middleware/auth.ts
export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: NextApiResponse): boolean => {
    if (!req.user) {
      // 인증 오류
    }
    if (!hasPermission(req.user.permissions, permission)) {
      // 권한 부족 오류
    }
    return true;
  };
}
```

**평가:** 인증/인가 시스템 우수 ✅

**보안 강화 권장사항:**

```typescript
// MFA (Multi-Factor Authentication) 지원
export interface MFAConfig {
  totpSecret?: string;
  backupCodes: string[];
  smsPhoneNumber?: string;
  emailBackup: boolean;
}

export interface ExtendedJWTPayload extends JWTPayload {
  mfaVerified: boolean;
  sessionId: string;
  lastActivity: number;
  deviceFingerprint?: string;
}

// 세션 기반 보안 강화
export class SecureSessionManager {
  static async createSession(
    userId: string,
    deviceInfo: DeviceInfo,
    ipAddress: string
  ): Promise<SessionData> {
    const sessionId = crypto.randomUUID();
    const deviceFingerprint = this.generateDeviceFingerprint(deviceInfo);

    // 기존 세션 무효화 (다른 기기에서 로그인)
    await this.invalidateOtherSessions(userId, deviceFingerprint);

    const payload: ExtendedJWTPayload = {
      id: userId,
      sessionId,
      mfaVerified: false,
      lastActivity: Date.now(),
      deviceFingerprint,
      // ... 기타 정보
    };

    // 데이터베이스에 세션 정보 저장
    await this.storeSessionInfo(sessionId, {
      userId,
      ipAddress,
      deviceInfo,
      createdAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
    });

    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(sessionId),
      expiresAt: new Date(Date.now() + parseMs(JWT_EXPIRES_IN)),
      sessionId,
    };
  }

  static generateDeviceFingerprint(deviceInfo: DeviceInfo): string {
    return crypto
      .createHash("sha256")
      .update(
        `${deviceInfo.userAgent}:${deviceInfo.screenResolution}:${deviceInfo.timezone}`
      )
      .digest("hex");
  }
}
```

### ✅ Rate Limiting System

**현재 Rate Limiting 구현:**

```typescript
// ✅ 포괄적인 Rate Limiting 시스템 - utils/rateLimiter.ts
export class MemoryRateLimiter {
  private records = new Map<string, RequestRecord>();

  public check(
    identifier: string,
    config: RateLimitConfig
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    totalHits: number;
  } {
    // 슬라이딩 윈도우 구현
  }
}

// ✅ 엔드포인트별 차등 제한
export const rateLimitConfigs = {
  consultationSubmit: {
    maxRequests: 3, // 3회
    windowMs: 10 * 60 * 1000, // 10분
  },
  authApi: {
    maxRequests: 5, // 5회
    windowMs: 15 * 60 * 1000, // 15분
  },
  adminApi: {
    maxRequests: 100, // 100회
    windowMs: 60 * 1000, // 1분
  },
} as const;

// ✅ 적응형 Rate Limiting
export class AdaptiveRateLimiter {
  public updateLoadFactor(cpuUsage: number, memoryUsage: number): void {
    if (avgUsage > 80) {
      this.loadFactor = 0.5; // 제한 강화
    }
  }
}
```

**평가:** Rate Limiting 시스템 우수 ✅

**추가 보안 권장사항:**

```typescript
// IP 평판 기반 차단
export class IPReputationFilter {
  private blockedIPs = new Set<string>();
  private suspiciousIPs = new Map<string, SuspiciousActivity>();

  public checkIPReputation(ip: string): IPReputationResult {
    // 악성 IP 데이터베이스 확인
    if (this.isKnownMaliciousIP(ip)) {
      return { allowed: false, reason: "MALICIOUS_IP" };
    }

    // 지리적 위치 기반 검증
    if (this.isUnusualLocation(ip)) {
      return { allowed: false, reason: "UNUSUAL_LOCATION" };
    }

    // 행동 패턴 분석
    const suspiciousActivity = this.analyzeBehavior(ip);
    if (suspiciousActivity.score > 0.8) {
      return { allowed: false, reason: "SUSPICIOUS_BEHAVIOR" };
    }

    return { allowed: true };
  }

  private analyzeBehavior(ip: string): SuspiciousActivity {
    // 요청 패턴 분석
    // - 너무 빠른 연속 요청
    // - 비정상적인 User-Agent
    // - 스캔 패턴 감지
    return {
      score: 0.0,
      indicators: [],
    };
  }
}

// Honeypot 기반 봇 탐지
export class HoneypotBotDetection {
  public addHoneypotField(formData: any): boolean {
    // 숨겨진 필드가 채워져 있으면 봇으로 간주
    const honeypotFields = ["website", "url", "homepage"];

    for (const field of honeypotFields) {
      if (formData[field] && formData[field].trim().length > 0) {
        return false; // 봇 감지
      }
    }

    return true; // 정상 사용자
  }
}
```

### ✅ Input Validation & Sanitization

**현재 입력 검증:**

```typescript
// ✅ 기본적인 XSS 방지 (추정)
function isSafeInput(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onload/i,
    /onerror/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];
  return !dangerousPatterns.some((pattern) => pattern.test(input));
}

// ✅ 기본적인 필드 검증
if (!rawData.contact.name || !rawData.contact.phone || !rawData.contact.email) {
  return res.status(400).json({ error: "Missing contact information" });
}
```

**평가:** 기본적인 입력 검증 구현됨 ⚠️

**보안 강화 권장사항:**

```typescript
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";

// 포괄적인 입력 검증 및 정제
export class SecuritySanitizer {
  // XSS 방지
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      FORBID_TAGS: ["script", "object", "embed", "iframe"],
      FORBID_ATTR: ["onclick", "onload", "onerror", "onmouseover"],
    });
  }

  // SQL Injection 패턴 검사
  static detectSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(--|\/\*|\*\/|;)/,
      /(\bor\b|\band\b).*?(\b=\b|\blike\b)/i,
      /(\bunion\b.*?\bselect\b)/i,
      /(\bdrop\b.*?\btable\b)/i,
      /(\bexec\b.*?\b)/i,
    ];
    return sqlPatterns.some((pattern) => pattern.test(input));
  }

  // NoSQL Injection 방지
  static sanitizeNoSqlInput(input: any): any {
    if (typeof input === "string") {
      return input.replace(/[{}$]/g, "");
    }
    if (typeof input === "object" && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        if (!key.startsWith("$") && !key.includes(".")) {
          sanitized[key] = this.sanitizeNoSqlInput(value);
        }
      }
      return sanitized;
    }
    return input;
  }

  // 경로 순회 공격 방지
  static sanitizeFilePath(filePath: string): string {
    return path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
  }

  // CSRF 토큰 생성 및 검증
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static verifyCSRFToken(token: string, sessionToken: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(sessionToken, "hex")
    );
  }
}

// 스키마 기반 검증 강화
export const SecureContactSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .max(50, "이름은 50자를 초과할 수 없습니다.")
    .regex(
      /^[가-힣a-zA-Z\s\-'\.]+$/,
      "이름에 허용되지 않는 문자가 포함되어 있습니다."
    )
    .refine(
      (val) => !SecuritySanitizer.detectSqlInjection(val),
      "유효하지 않은 입력입니다."
    ),

  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다.")
    .max(100, "이메일은 100자를 초과할 수 없습니다.")
    .refine((val) => !val.includes("<script"), "XSS 공격이 감지되었습니다."),

  phone: z
    .string()
    .regex(/^01[0-9]-[0-9]{4}-[0-9]{4}$/, "올바른 전화번호 형식이 아닙니다.")
    .refine(
      (val) => !/[<>&"']/.test(val),
      "허용되지 않는 문자가 포함되어 있습니다."
    ),

  message: z
    .string()
    .max(2000, "메시지는 2000자를 초과할 수 없습니다.")
    .refine((val) => {
      const sanitized = SecuritySanitizer.sanitizeHtml(val);
      return sanitized.length > 0;
    }, "유효하지 않은 내용입니다."),
});
```

### ✅ Password Security

**현재 비밀번호 보안:**

```typescript
// ✅ bcrypt 사용 - services/auth.ts
import bcrypt from "bcryptjs";

// 비밀번호 해싱
const hashedPassword = await bcrypt.hash(password, 12);

// 비밀번호 검증
const isValid = await bcrypt.compare(password, hashedPassword);
```

**평가:** 비밀번호 해싱 우수 ✅

**추가 보안 권장사항:**

```typescript
// 비밀번호 복잡도 정책
export class PasswordPolicy {
  static readonly REQUIREMENTS = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireDigits: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventUserInfoInPassword: true,
  };

  static validate(password: string, userInfo?: UserInfo): ValidationResult {
    const errors: string[] = [];

    // 길이 검증
    if (password.length < this.REQUIREMENTS.minLength) {
      errors.push(
        `비밀번호는 최소 ${this.REQUIREMENTS.minLength}자 이상이어야 합니다.`
      );
    }

    if (password.length > this.REQUIREMENTS.maxLength) {
      errors.push(
        `비밀번호는 최대 ${this.REQUIREMENTS.maxLength}자를 초과할 수 없습니다.`
      );
    }

    // 복잡도 검증
    if (this.REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("대문자를 포함해야 합니다.");
    }

    if (this.REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("소문자를 포함해야 합니다.");
    }

    if (this.REQUIREMENTS.requireDigits && !/\d/.test(password)) {
      errors.push("숫자를 포함해야 합니다.");
    }

    if (
      this.REQUIREMENTS.requireSpecialChars &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      errors.push("특수문자를 포함해야 합니다.");
    }

    // 일반적인 비밀번호 검증
    if (this.isCommonPassword(password)) {
      errors.push("너무 일반적인 비밀번호입니다.");
    }

    // 사용자 정보 포함 검증
    if (userInfo && this.containsUserInfo(password, userInfo)) {
      errors.push("비밀번호에 개인정보가 포함되어서는 안 됩니다.");
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: this.calculateStrength(password),
    };
  }

  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      "password",
      "123456",
      "password123",
      "admin",
      "qwerty",
      "letmein",
      "welcome",
      "monkey",
      "1234567890",
    ];
    return commonPasswords.includes(password.toLowerCase());
  }

  private static containsUserInfo(
    password: string,
    userInfo: UserInfo
  ): boolean {
    const lowerPassword = password.toLowerCase();
    return (
      lowerPassword.includes(userInfo.name.toLowerCase()) ||
      lowerPassword.includes(userInfo.email.split("@")[0].toLowerCase()) ||
      lowerPassword.includes(userInfo.company?.toLowerCase() || "")
    );
  }

  private static calculateStrength(password: string): PasswordStrength {
    let score = 0;

    // 길이 점수
    score += Math.min(password.length * 4, 40);

    // 문자 유형별 점수
    if (/[a-z]/.test(password)) score += 5;
    if (/[A-Z]/.test(password)) score += 5;
    if (/\d/.test(password)) score += 5;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;

    // 패턴 다양성 점수
    const uniqueChars = new Set(password).size;
    score += Math.min(uniqueChars * 2, 20);

    if (score < 30) return "weak";
    if (score < 60) return "medium";
    if (score < 90) return "strong";
    return "very_strong";
  }
}

// 계정 잠금 정책
export class AccountLockoutPolicy {
  static readonly CONFIG = {
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15,
    progressiveLockout: true, // 반복 실패 시 잠금 시간 증가
  };

  static async handleFailedLogin(userId: string): Promise<LockoutResult> {
    const attempts = await this.getFailedAttempts(userId);
    const newAttemptCount = attempts + 1;

    await this.recordFailedAttempt(userId, newAttemptCount);

    if (newAttemptCount >= this.CONFIG.maxFailedAttempts) {
      const lockoutDuration = this.calculateLockoutDuration(attempts);
      await this.lockAccount(userId, lockoutDuration);

      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutExpiresAt: new Date(Date.now() + lockoutDuration),
      };
    }

    return {
      isLocked: false,
      remainingAttempts: this.CONFIG.maxFailedAttempts - newAttemptCount,
      lockoutExpiresAt: null,
    };
  }

  private static calculateLockoutDuration(previousAttempts: number): number {
    if (!this.CONFIG.progressiveLockout) {
      return this.CONFIG.lockoutDurationMinutes * 60 * 1000;
    }

    // 지수적 증가: 15분, 30분, 1시간, 2시간, 4시간
    const multiplier = Math.pow(
      2,
      Math.floor(previousAttempts / this.CONFIG.maxFailedAttempts)
    );
    return (
      this.CONFIG.lockoutDurationMinutes * 60 * 1000 * Math.min(multiplier, 16)
    );
  }
}
```

### ✅ HTTPS & Transport Security

**현재 전송 보안:**

```typescript
// ✅ 환경변수로 HTTPS 설정 관리
NEXT_PUBLIC_APP_URL=http://localhost:3000  // 개발환경
// 프로덕션: https://LeoFitTech.com

// ✅ JWT 토큰에 보안 설정
{
  issuer: 'LeoFitTech-api',
  audience: 'LeoFitTech-admin',
}
```

**개선 권장사항:**

```typescript
// Security Headers 미들웨어
export function securityHeaders(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  // HTTPS 강제 (HSTS)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // XSS 보호
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // MIME 타입 스니핑 방지
  res.setHeader("X-Content-Type-Options", "nosniff");

  // 클릭재킹 방지
  res.setHeader("X-Frame-Options", "DENY");

  // Referrer 정책
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    ["camera=()", "microphone=()", "geolocation=()", "payment=(*)"].join(", ")
  );
}
```

## 📊 Security Implementation 점수 현황

### 🟢 우수한 영역 (90-100점)

- **Authentication System**: JWT + RBAC 완벽 구현
- **Rate Limiting**: 포괄적인 제한 시스템
- **Password Security**: bcrypt 해싱 적용
- **Authorization**: 세분화된 권한 관리

### 🟡 개선 필요 영역 (70-89점)

- **Input Validation**: 기본적 검증만 구현
- **Security Headers**: 미구현 상태
- **MFA Support**: 다단계 인증 부재
- **Session Management**: 기본적 구현

### 🔴 시급 개선 영역 (60-69점)

- **CSRF Protection**: CSRF 토큰 미구현
- **SQL Injection Prevention**: 기본적 방어만
- **File Upload Security**: 파일 업로드 보안 부족
- **Audit Logging**: 보안 이벤트 로깅 부족

## 🎯 보안 개선 Action Items

### 우선순위 1 (Critical)

1. **Security Headers 구현**

   ```typescript
   // HTTPS, CSP, HSTS 등 필수 보안 헤더
   ```

2. **CSRF Protection 추가**

   ```typescript
   // Double Submit Cookie 패턴 구현
   ```

3. **Input Validation 강화**
   ```bash
   npm install zod dompurify
   # 포괄적인 입력 검증 및 정제
   ```

### 우선순위 2 (High)

1. **Multi-Factor Authentication**

   - TOTP 기반 2FA 구현
   - 백업 코드 시스템

2. **Advanced Session Management**

   - 디바이스 핑거프린팅
   - 동시 세션 제한

3. **Audit Logging System**
   - 보안 이벤트 추적
   - 실시간 알림 시스템

### 우선순위 3 (Medium)

1. **File Upload Security**

   - 파일 타입 검증
   - 바이러스 스캔 연동

2. **IP Reputation Filtering**

   - 악성 IP 차단
   - 지리적 위치 기반 제한

3. **Penetration Testing**
   - 정기적인 보안 테스트
   - 취약점 스캔

---

**전체 Security Implementation 점수: 78/100** 🟡

다음으로 성능 최적화를 검토하겠습니다.
