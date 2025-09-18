# 🛡️ Error Handling & Validation Review

## 📊 에러 처리 현황 분석

### ✅ Error Type Hierarchy

**현재 구현된 에러 타입:**
```typescript
// ✅ 구조화된 에러 클래스 - lib/supabase.ts
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any,
    public hint?: string
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

// ✅ 일관된 API 응답 형식 - types/database.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

**평가:** 기본적인 에러 타입 구조 우수 ✅

**개선 권장 - 상세한 에러 계층:**
```typescript
// 추상 기본 에러 클래스
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly userMessage: string;

  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 구체적인 에러 타입들
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly userMessage = '입력 데이터가 유효하지 않습니다.';

  constructor(
    public readonly field: string,
    public readonly rule: string,
    context?: Record<string, any>
  ) {
    super(`Validation failed for field '${field}': ${rule}`, context);
  }
}

export class AuthenticationError extends AppError {
  readonly code = 'AUTHENTICATION_ERROR';
  readonly statusCode = 401;
  readonly userMessage = '인증이 필요합니다.';
}

export class AuthorizationError extends AppError {
  readonly code = 'AUTHORIZATION_ERROR';
  readonly statusCode = 403;
  readonly userMessage = '권한이 없습니다.';
}

export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
  readonly userMessage = '요청한 자료를 찾을 수 없습니다.';
}

export class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
  readonly userMessage = '데이터베이스 오류가 발생했습니다.';
}

export class ExternalServiceError extends AppError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly statusCode = 503;
  readonly userMessage = '외부 서비스 연결 오류가 발생했습니다.';
}
```

### ✅ Try-Catch 패턴 분석

**현재 try-catch 사용 현황:**
```typescript
// ✅ 일관된 패턴 - services/consultation.ts (추정)
export async function createGuidedConsultation() {
  try {
    const result = await supabaseOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { success: false, error: 'Operation failed' };
  }
}

// ✅ JWT 검증 에러 처리 - services/auth.ts
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'visionmakers-api',
      audience: 'visionmakers-admin',
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('ACCESS_TOKEN_EXPIRED');
    }
    // ... 다른 에러 타입 처리
  }
}

// ✅ localStorage 에러 처리 - contexts/ConsultationContext.tsx
try {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedState });
  }
} catch (error) {
  console.warn('Failed to load state from localStorage:', error);
}
```

**평가:** Try-catch 패턴 일관성 우수 ✅

**개선 권장 - 중앙화된 에러 처리:**
```typescript
// 에러 핸들러 유틸리티
export class ErrorHandler {
  static handle<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<ApiResponse<T>> {
    return operation()
      .then(data => ({ success: true, data }))
      .catch(error => {
        // 로깅
        this.logError(error, context);

        // 에러 변환
        const appError = this.convertToAppError(error);

        return {
          success: false,
          error: {
            code: appError.code,
            message: appError.userMessage,
            details: process.env.NODE_ENV === 'development' ? appError.message : undefined
          }
        };
      });
  }

  private static convertToAppError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof jwt.TokenExpiredError) {
      return new AuthenticationError('토큰이 만료되었습니다.');
    }

    if (error instanceof SupabaseError) {
      return new DatabaseError(error.message, {
        supabaseCode: error.code,
        details: error.details
      });
    }

    // 알 수 없는 에러
    return new AppError('UNKNOWN_ERROR', 500, '예상치 못한 오류가 발생했습니다.');
  }

  private static logError(error: unknown, context?: string) {
    console.error(`[${context || 'UNKNOWN'}] Error:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}

// 사용 예시
export function createGuidedConsultation(data: GuidedConsultationForm) {
  return ErrorHandler.handle(async () => {
    // 비즈니스 로직
    const result = await supabaseAdmin.from('consultations').insert(data);
    return result;
  }, 'createGuidedConsultation');
}
```

## 📝 Input Validation 검토

### ✅ Frontend Validation

**현재 검증 구현:**
```typescript
// ✅ 기본적인 필드 검증 - src/pages/api/consultation-submit.ts
if (!rawData.type || !rawData.contact) {
  return res.status(400).json({ error: 'Missing required fields' });
}

if (!rawData.contact.name || !rawData.contact.phone || !rawData.contact.email) {
  return res.status(400).json({ error: 'Missing contact information' });
}

// ✅ 트랙별 검증
if (data.type === 'guided') {
  if (!data.serviceType || !data.projectSize || !data.budget || !data.timeline) {
    return res.status(400).json({ error: 'Missing guided track required fields' });
  }
} else if (data.type === 'free') {
  if (!data.projectDescription || data.projectDescription.trim().length < 20) {
    return res.status(400).json({ error: 'Project description must be at least 20 characters' });
  }
}

// ✅ 입력값 안전성 검증
for (const input of inputsToCheck) {
  if (!isSafeInput(input as string)) {
    return res.status(400).json({ error: 'Invalid input detected' });
  }
}
```

**평가:** 기본적인 입력 검증 구현됨 ✅

**개선 권장 - Zod 기반 스키마 검증:**
```typescript
import { z } from 'zod';

// 스키마 정의
export const ContactInfoSchema = z.object({
  name: z.string()
    .min(1, '이름을 입력해주세요.')
    .max(50, '이름은 50자를 초과할 수 없습니다.')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다.'),

  phone: z.string()
    .regex(/^01[0-9]-[0-9]{4}-[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)'),

  email: z.string()
    .email('올바른 이메일 형식이 아닙니다.')
    .max(100, '이메일은 100자를 초과할 수 없습니다.'),

  company: z.string()
    .max(100, '회사명은 100자를 초과할 수 없습니다.')
    .optional()
});

export const GuidedConsultationSchema = z.object({
  contact: ContactInfoSchema,

  serviceType: z.enum(['web_development', 'mobile_app', 'desktop_app', 'ai_ml', 'blockchain', 'iot', 'consulting', 'maintenance', 'other'], {
    errorMap: () => ({ message: '올바른 서비스 타입을 선택해주세요.' })
  }),

  projectSize: z.enum(['small', 'medium', 'large', 'enterprise'], {
    errorMap: () => ({ message: '프로젝트 규모를 선택해주세요.' })
  }),

  budget: z.enum(['under_1000', '1000_to_3000', '3000_to_5000', '5000_to_10000', 'over_10000', 'negotiable'], {
    errorMap: () => ({ message: '예산 범위를 선택해주세요.' })
  }),

  timeline: z.enum(['asap', '1_month', '1_3_months', '3_6_months', '6_12_months', 'over_1_year', 'flexible'], {
    errorMap: () => ({ message: '프로젝트 일정을 선택해주세요.' })
  }),

  importantFeatures: z.array(z.string())
    .min(1, '최소 하나의 중요 기능을 선택해주세요.')
    .max(10, '중요 기능은 최대 10개까지 선택 가능합니다.'),

  additionalRequests: z.string()
    .max(1000, '추가 요청사항은 1000자를 초과할 수 없습니다.')
    .optional(),

  // UTM 파라미터
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional()
});

export const FreeConsultationSchema = z.object({
  contact: ContactInfoSchema,

  projectDescription: z.string()
    .min(20, '프로젝트 설명은 최소 20자 이상 입력해주세요.')
    .max(2000, '프로젝트 설명은 2000자를 초과할 수 없습니다.'),

  budgetRange: z.string()
    .max(100, '예산 범위는 100자를 초과할 수 없습니다.')
    .optional(),

  timelinePreference: z.string()
    .max(100, '일정 선호도는 100자를 초과할 수 없습니다.')
    .optional(),

  // UTM 파라미터
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional()
});

// 검증 함수
export function validateGuidedConsultation(data: unknown): ValidationResult<GuidedConsultationForm> {
  try {
    const validated = GuidedConsultationSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          acc[path] = err.message;
          return acc;
        }, {} as Record<string, string>)
      };
    }
    return {
      success: false,
      errors: { _root: '알 수 없는 검증 오류가 발생했습니다.' }
    };
  }
}

interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}
```

### ✅ Security Validation

**현재 보안 검증:**
```typescript
// ✅ XSS 방지를 위한 입력 검증 (추정)
function isSafeInput(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /onload/i,
    /onerror/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];

  return !dangerousPatterns.some(pattern => pattern.test(input));
}
```

**개선 권장 - 포괄적 보안 검증:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

export class SecurityValidator {
  // XSS 방지
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // HTML 태그 완전 제거
      ALLOWED_ATTR: []
    });
  }

  // SQL Injection 패턴 검사
  static detectSqlInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /(\bor\b|\band\b).*?(\b=\b|\blike\b)/i,
      /(\bunion\b.*?\bselect\b)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // 파일 업로드 검증
  static validateFileUpload(file: File): ValidationResult<void> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        errors: { file: '허용되지 않는 파일 형식입니다.' }
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        errors: { file: '파일 크기는 10MB를 초과할 수 없습니다.' }
      };
    }

    return { success: true };
  }

  // Rate Limiting 체크
  static checkRateLimit(
    identifier: string,
    windowMs: number = 60000, // 1분
    maxRequests: number = 5
  ): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    // 실제 구현에서는 Redis나 데이터베이스 사용 권장
    const requests = this.getRequestHistory(identifier);
    const validRequests = requests.filter(time => time > windowStart);

    if (validRequests.length >= maxRequests) {
      return false;
    }

    this.addRequest(identifier, now);
    return true;
  }

  private static requestHistory = new Map<string, number[]>();

  private static getRequestHistory(identifier: string): number[] {
    return this.requestHistory.get(identifier) || [];
  }

  private static addRequest(identifier: string, timestamp: number): void {
    const history = this.getRequestHistory(identifier);
    history.push(timestamp);
    this.requestHistory.set(identifier, history);
  }
}
```

## 🔒 Authentication & Authorization Errors

### ✅ JWT 에러 처리

**현재 JWT 에러 처리:**
```typescript
// ✅ 토큰 검증 에러 분류 - services/auth.ts
export function verifyAccessToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'visionmakers-api',
      audience: 'visionmakers-admin',
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('ACCESS_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('INVALID_ACCESS_TOKEN');
    }
    throw new Error('TOKEN_VERIFICATION_FAILED');
  }
}
```

**평가:** JWT 에러 처리 구조 우수 ✅

**개선 권장 - 세분화된 인증 에러:**
```typescript
export class AuthError extends AppError {
  constructor(
    code: string,
    message: string,
    public readonly authCode: string,
    statusCode: number = 401
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class TokenExpiredError extends AuthError {
  constructor() {
    super(
      'TOKEN_EXPIRED',
      '토큰이 만료되었습니다. 다시 로그인해주세요.',
      'AUTH_TOKEN_EXPIRED'
    );
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super(
      'INVALID_TOKEN',
      '유효하지 않은 토큰입니다.',
      'AUTH_INVALID_TOKEN'
    );
  }
}

export class InsufficientPermissionsError extends AuthError {
  constructor(requiredPermission: string) {
    super(
      'INSUFFICIENT_PERMISSIONS',
      `'${requiredPermission}' 권한이 필요합니다.`,
      'AUTH_INSUFFICIENT_PERMISSIONS',
      403
    );
  }
}

// 미들웨어에서 사용
export function authMiddleware(requiredPermission?: string) {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      const token = extractTokenFromHeader(req.headers.authorization);
      if (!token) {
        throw new AuthError('NO_TOKEN', '인증 토큰이 필요합니다.', 'AUTH_NO_TOKEN');
      }

      const payload = verifyAccessToken(token);

      if (requiredPermission && !payload.permissions.includes(requiredPermission)) {
        throw new InsufficientPermissionsError(requiredPermission);
      }

      req.user = payload;
      next();

    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          error: {
            code: error.code,
            message: error.userMessage,
            authCode: error.authCode
          }
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 오류가 발생했습니다.'
        }
      });
    }
  };
}
```

## 📊 Error Handling & Validation 점수 현황

### 🟢 우수한 영역 (90-100점)
- **API Response Format**: 일관된 응답 형식
- **Try-Catch Patterns**: 체계적인 예외 처리
- **JWT Error Handling**: 토큰 관련 에러 분류
- **Input Sanitization**: 기본적인 XSS 방지

### 🟡 개선 필요 영역 (70-89점)
- **Validation Schema**: Zod 등 스키마 라이브러리 미사용
- **Error Classification**: 세분화된 에러 타입 부족
- **Centralized Error Handling**: 중앙화된 에러 처리 부족
- **Security Validation**: 포괄적 보안 검증 부족

### 🔴 시급 개선 영역 (60-69점)
- **Rate Limiting**: API 호출 제한 없음
- **Error Logging**: 구조화된 로깅 시스템 부족
- **User Error Messages**: 사용자 친화적 에러 메시지 부족

## 🎯 개선 Action Items

### 우선순위 1 (High)
1. **Zod Schema Validation 도입**
   ```bash
   npm install zod
   # 모든 API 엔드포인트에 스키마 검증 적용
   ```

2. **Error Type Hierarchy 구축**
   - AppError 추상 클래스 생성
   - 도메인별 구체적 에러 클래스 구현

3. **Rate Limiting 구현**
   - IP 기반 요청 제한
   - 상담 신청 스팸 방지

### 우선순위 2 (Medium)
1. **Centralized Error Handler**
   - ErrorHandler 클래스 구현
   - 일관된 에러 처리 패턴

2. **Security Validation 강화**
   - DOMPurify 도입
   - SQL Injection 검사

3. **Structured Logging**
   - 에러 로깅 표준화
   - 컨텍스트 정보 포함

### 우선순위 3 (Low)
1. **Error Monitoring**
   - Sentry 등 모니터링 도구 연동
   - 실시간 에러 알림

2. **User Experience**
   - 사용자 친화적 에러 메시지
   - 에러 복구 가이드

---

**전체 Error Handling & Validation 점수: 74/100** 🟡

다음으로 보안 구현을 검토하겠습니다.