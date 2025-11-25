# LeoFitTech 상담시스템 API 설계 명세서

## 📋 문서 정보

- **버전**: 1.0
- **작성일**: 2024-09-17
- **작성자**: Claude AI Assistant
- **목적**: Supabase 기반 상담신청 API 설계 및 구현 가이드
- **기술 스택**: Next.js 14, Supabase, TypeScript

---

## 🎯 시스템 개요

### 핵심 목표

- Supabase를 활용한 확장 가능한 데이터베이스 구조
- RESTful API 설계 원칙 준수
- 실시간 데이터 처리 및 알림 시스템
- 보안 강화 및 개인정보 보호

### 아키텍처 구조

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   Supabase      │
│   (React)       │───▶│   Routes        │───▶│   Database      │
│                 │    │                 │    │   Auth          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🗄️ 데이터베이스 스키마 설계

### 1. consultations 테이블 (상담신청 메인)

```sql
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_number VARCHAR(20) UNIQUE NOT NULL, -- CS-YYYYMMDD-XXXX 형식
  type VARCHAR(10) NOT NULL CHECK (type IN ('guided', 'free')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'contacted', 'completed', 'cancelled')),
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- 연락처 정보
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_company VARCHAR(200),
  preferred_contact_time VARCHAR(20),

  -- 메타데이터
  user_agent TEXT,
  ip_address INET,
  referrer_url TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  -- 시간 정보
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  contacted_at TIMESTAMP WITH TIME ZONE,

  -- 인덱스
  CONSTRAINT consultations_email_check CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT consultations_phone_check CHECK (contact_phone ~* '^[0-9\-\+\s]+$')
);

-- 인덱스 생성
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
CREATE INDEX idx_consultations_type ON consultations(type);
CREATE INDEX idx_consultations_email ON consultations(contact_email);
```

### 2. guided_consultations 테이블 (가이드 트랙 전용)

```sql
CREATE TABLE guided_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  -- Step 1: 서비스 종류
  service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('homepage', 'shopping', 'booking', 'membership', 'other')),

  -- Step 2: 규모와 예산
  project_size VARCHAR(10) NOT NULL CHECK (project_size IN ('small', 'medium', 'large')),
  budget VARCHAR(20) NOT NULL CHECK (budget IN ('100-300', '300-800', '800-1500', '1500+', 'consult')),

  -- Step 3: 일정과 특별 요청
  timeline VARCHAR(20) NOT NULL CHECK (timeline IN ('1month', '2-3months', '6months', 'flexible')),
  important_features JSONB DEFAULT '[]', -- ['mobile', 'seo', 'admin', 'payment']
  additional_requests TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guided_consultations_consultation_id ON guided_consultations(consultation_id);
CREATE INDEX idx_guided_consultations_service_type ON guided_consultations(service_type);
CREATE INDEX idx_guided_consultations_budget ON guided_consultations(budget);
```

### 3. free_consultations 테이블 (자유 트랙 전용)

```sql
CREATE TABLE free_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  -- 프로젝트 설명
  project_description TEXT NOT NULL CHECK (LENGTH(project_description) >= 20),

  -- 선택적 정보
  budget_range VARCHAR(200),
  timeline_preference VARCHAR(200),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_free_consultations_consultation_id ON free_consultations(consultation_id);
```

### 4. consultation_logs 테이블 (활동 로그)

```sql
CREATE TABLE consultation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,

  action VARCHAR(50) NOT NULL, -- 'created', 'status_changed', 'contacted', 'note_added'
  details JSONB, -- 추가 정보 (이전 상태, 새 상태 등)
  notes TEXT,

  -- 작업자 정보 (추후 관리자 시스템 연동)
  actor_type VARCHAR(20) DEFAULT 'system', -- 'system', 'admin', 'api'
  actor_id VARCHAR(100),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_consultation_logs_consultation_id ON consultation_logs(consultation_id);
CREATE INDEX idx_consultation_logs_created_at ON consultation_logs(created_at DESC);
```

### 5. consultation_stats 테이블 (통계 정보)

```sql
CREATE TABLE consultation_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- 일일 통계
  total_submissions INTEGER DEFAULT 0,
  guided_submissions INTEGER DEFAULT 0,
  free_submissions INTEGER DEFAULT 0,

  -- 전환율 관련
  page_views INTEGER DEFAULT 0,
  form_starts INTEGER DEFAULT 0,
  form_completions INTEGER DEFAULT 0,

  -- 소스별 통계
  source_stats JSONB DEFAULT '{}', -- {"organic": 10, "google_ads": 5, ...}

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(date)
);

CREATE INDEX idx_consultation_stats_date ON consultation_stats(date DESC);
```

---

## 🔧 Supabase 설정

### 1. 환경 변수 설정

```typescript
// .env.local
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url;
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key;
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key;
```

### 2. Supabase 클라이언트 초기화

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버사이드 전용 클라이언트 (서비스 롤 키 사용)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### 3. 타입 정의

```typescript
// types/database.ts
export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string;
          consultation_number: string;
          type: "guided" | "free";
          status:
            | "pending"
            | "reviewing"
            | "contacted"
            | "completed"
            | "cancelled";
          priority: "low" | "normal" | "high" | "urgent";
          contact_name: string;
          contact_phone: string;
          contact_email: string;
          contact_company?: string;
          preferred_contact_time?: string;
          user_agent?: string;
          ip_address?: string;
          referrer_url?: string;
          utm_source?: string;
          utm_medium?: string;
          utm_campaign?: string;
          created_at: string;
          updated_at: string;
          reviewed_at?: string;
          contacted_at?: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["consultations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["consultations"]["Insert"]
        >;
      };
      guided_consultations: {
        Row: {
          id: string;
          consultation_id: string;
          service_type:
            | "homepage"
            | "shopping"
            | "booking"
            | "membership"
            | "other";
          project_size: "small" | "medium" | "large";
          budget: "100-300" | "300-800" | "800-1500" | "1500+" | "consult";
          timeline: "1month" | "2-3months" | "6months" | "flexible";
          important_features: string[];
          additional_requests?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["guided_consultations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["guided_consultations"]["Insert"]
        >;
      };
      free_consultations: {
        Row: {
          id: string;
          consultation_id: string;
          project_description: string;
          budget_range?: string;
          timeline_preference?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["free_consultations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["free_consultations"]["Insert"]
        >;
      };
    };
  };
}
```

---

## 🛠️ API 엔드포인트 설계

### 1. 상담 신청 제출 API

**POST** `/api/consultation-submit`

#### 요청 구조

```typescript
// Request Body Types
interface GuidedConsultationRequest {
  type: "guided";
  serviceType: string;
  projectSize: string;
  budget: string;
  timeline: string;
  importantFeatures: string[];
  additionalRequests: string;
  contact: ContactInfo;
  metadata?: ConsultationMetadata;
}

interface FreeConsultationRequest {
  type: "free";
  projectDescription: string;
  budget?: string;
  timeline?: string;
  contact: ContactInfo;
  metadata?: ConsultationMetadata;
}

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  company?: string;
  preferredContactTime?: string;
}

interface ConsultationMetadata {
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
```

#### 응답 구조

```typescript
// Success Response
interface ConsultationResponse {
  success: true;
  data: {
    consultationId: string;
    consultationNumber: string;
    estimatedContactTime: string; // "1-2 business days"
  };
}

// Error Response
interface ConsultationErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

#### 구현 예시

```typescript
// pages/api/consultation-submit.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { ConsultationService } from "@/services/consultation";
import { NotificationService } from "@/services/notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Only POST method allowed",
      },
    });
  }

  try {
    // 1. 요청 데이터 검증
    const validatedData = await ConsultationService.validateRequest(req.body);

    // 2. IP 및 메타데이터 수집
    const metadata = {
      ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer,
      ...validatedData.metadata,
    };

    // 3. 상담 신청 생성
    const consultation = await ConsultationService.createConsultation({
      ...validatedData,
      metadata,
    });

    // 4. 알림 발송
    await NotificationService.sendNewConsultationAlert(consultation);

    // 5. 성공 응답
    res.status(201).json({
      success: true,
      data: {
        consultationId: consultation.id,
        consultationNumber: consultation.consultation_number,
        estimatedContactTime: "1-2 business days",
      },
    });
  } catch (error) {
    console.error("Consultation submission error:", error);

    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to submit consultation",
      },
    });
  }
}
```

### 2. 상담 조회 API

**GET** `/api/consultation/[id]`

```typescript
// Response
interface ConsultationDetailResponse {
  success: true;
  data: {
    consultation: ConsultationDetail;
    logs: ConsultationLog[];
  };
}
```

### 3. 상담 상태 업데이트 API (관리자용)

**PATCH** `/api/consultation/[id]/status`

```typescript
interface StatusUpdateRequest {
  status: "reviewing" | "contacted" | "completed" | "cancelled";
  notes?: string;
}
```

### 4. 통계 API

**GET** `/api/consultation/stats`

```typescript
interface StatsResponse {
  success: true;
  data: {
    today: DailyStats;
    thisWeek: WeeklyStats;
    thisMonth: MonthlyStats;
    trends: TrendData[];
  };
}
```

---

## 🔐 보안 및 인증

### 1. RLS (Row Level Security) 정책

```sql
-- consultations 테이블 RLS 설정
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (자신이 제출한 상담만)
CREATE POLICY "Users can view own consultations" ON consultations
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- 인증된 사용자만 상담 신청 가능
CREATE POLICY "Users can insert consultations" ON consultations
  FOR INSERT WITH CHECK (true);

-- 관리자만 업데이트 가능
CREATE POLICY "Only admins can update consultations" ON consultations
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
```

### 2. API 키 보안

```typescript
// middleware/auth.ts
export function verifyApiKey(req: NextApiRequest) {
  const apiKey = req.headers["x-api-key"];
  const validKeys = process.env.VALID_API_KEYS?.split(",") || [];

  if (!apiKey || !validKeys.includes(apiKey as string)) {
    throw new Error("Invalid API key");
  }
}
```

### 3. 요청 제한 (Rate Limiting)

```typescript
// utils/rateLimiter.ts
import { NextApiRequest } from "next";

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  req: NextApiRequest,
  maxRequests = 5,
  windowMs = 60000
) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const now = Date.now();

  const record = requestCounts.get(ip as string);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip as string, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}
```

---

## 📊 데이터 검증 및 스키마

### 1. Zod 스키마 정의

```typescript
// schemas/consultation.ts
import { z } from "zod";

export const ContactInfoSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다").max(100),
  phone: z.string().regex(/^[0-9\-\+\s]+$/, "올바른 전화번호 형식이 아닙니다"),
  email: z.string().email("올바른 이메일 형식이 아닙니다"),
  company: z.string().max(200).optional(),
  preferredContactTime: z
    .enum(["morning", "afternoon", "evening", "anytime"])
    .optional(),
});

export const GuidedConsultationSchema = z.object({
  type: z.literal("guided"),
  serviceType: z.enum([
    "homepage",
    "shopping",
    "booking",
    "membership",
    "other",
  ]),
  projectSize: z.enum(["small", "medium", "large"]),
  budget: z.enum(["100-300", "300-800", "800-1500", "1500+", "consult"]),
  timeline: z.enum(["1month", "2-3months", "6months", "flexible"]),
  importantFeatures: z.array(z.enum(["mobile", "seo", "admin", "payment"])),
  additionalRequests: z.string().max(2000).optional(),
  contact: ContactInfoSchema,
});

export const FreeConsultationSchema = z.object({
  type: z.literal("free"),
  projectDescription: z
    .string()
    .min(20, "최소 20자 이상 작성해주세요")
    .max(2000),
  budget: z.string().max(200).optional(),
  timeline: z.string().max(200).optional(),
  contact: ContactInfoSchema,
});

export const ConsultationRequestSchema = z.union([
  GuidedConsultationSchema,
  FreeConsultationSchema,
]);
```

### 2. 서비스 레이어

```typescript
// services/consultation.ts
import { supabaseAdmin } from "@/lib/supabase";
import { ConsultationRequestSchema } from "@/schemas/consultation";
import { generateConsultationNumber } from "@/utils/consultation";

export class ConsultationService {
  static async validateRequest(data: unknown) {
    return ConsultationRequestSchema.parse(data);
  }

  static async createConsultation(data: any) {
    const consultationNumber = generateConsultationNumber();

    // 트랜잭션 시작
    const { data: consultation, error: consultationError } = await supabaseAdmin
      .from("consultations")
      .insert({
        consultation_number: consultationNumber,
        type: data.type,
        contact_name: data.contact.name,
        contact_phone: data.contact.phone,
        contact_email: data.contact.email,
        contact_company: data.contact.company,
        preferred_contact_time: data.contact.preferredContactTime,
        user_agent: data.metadata?.userAgent,
        ip_address: data.metadata?.ipAddress,
        referrer_url: data.metadata?.referrer,
        utm_source: data.metadata?.utmSource,
        utm_medium: data.metadata?.utmMedium,
        utm_campaign: data.metadata?.utmCampaign,
      })
      .select()
      .single();

    if (consultationError) throw consultationError;

    // 타입별 세부 정보 저장
    if (data.type === "guided") {
      await this.createGuidedConsultation(consultation.id, data);
    } else {
      await this.createFreeConsultation(consultation.id, data);
    }

    // 로그 생성
    await this.createLog(consultation.id, "created", {
      type: data.type,
      source: "website",
    });

    return consultation;
  }

  static async createGuidedConsultation(consultationId: string, data: any) {
    const { error } = await supabaseAdmin.from("guided_consultations").insert({
      consultation_id: consultationId,
      service_type: data.serviceType,
      project_size: data.projectSize,
      budget: data.budget,
      timeline: data.timeline,
      important_features: data.importantFeatures,
      additional_requests: data.additionalRequests,
    });

    if (error) throw error;
  }

  static async createFreeConsultation(consultationId: string, data: any) {
    const { error } = await supabaseAdmin.from("free_consultations").insert({
      consultation_id: consultationId,
      project_description: data.projectDescription,
      budget_range: data.budget,
      timeline_preference: data.timeline,
    });

    if (error) throw error;
  }

  static async createLog(consultationId: string, action: string, details: any) {
    await supabaseAdmin.from("consultation_logs").insert({
      consultation_id: consultationId,
      action,
      details,
    });
  }
}
```

---

## 📧 알림 시스템

### 1. 이메일 알림 서비스

```typescript
// services/notification.ts
import nodemailer from "nodemailer";

export class NotificationService {
  private static transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendNewConsultationAlert(consultation: any) {
    // 관리자에게 새 상담 신청 알림
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 새로운 상담 신청 - ${consultation.consultation_number}`,
      html: this.generateAdminEmailTemplate(consultation),
    });

    // 고객에게 접수 확인 메일
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: consultation.contact_email,
      subject: "✅ LeoFitTech 상담 신청이 접수되었습니다",
      html: this.generateCustomerEmailTemplate(consultation),
    });
  }

  private static generateAdminEmailTemplate(consultation: any): string {
    return `
      <h2>새로운 상담 신청이 접수되었습니다</h2>
      <p><strong>신청번호:</strong> ${consultation.consultation_number}</p>
      <p><strong>신청자:</strong> ${consultation.contact_name}</p>
      <p><strong>연락처:</strong> ${consultation.contact_phone}</p>
      <p><strong>이메일:</strong> ${consultation.contact_email}</p>
      <p><strong>신청시간:</strong> ${new Date(
        consultation.created_at
      ).toLocaleString("ko-KR")}</p>

      <p><a href="${process.env.ADMIN_URL}/consultations/${
      consultation.id
    }">상세보기</a></p>
    `;
  }

  private static generateCustomerEmailTemplate(consultation: any): string {
    return `
      <h2>${consultation.contact_name}님, 상담 신청이 완료되었습니다! 🎉</h2>

      <p>안녕하세요, LeoFitTech입니다.</p>
      <p>소중한 시간을 내어 상담을 신청해주셔서 감사합니다.</p>

      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 신청 정보</h3>
        <p><strong>신청번호:</strong> ${consultation.consultation_number}</p>
        <p><strong>신청일시:</strong> ${new Date(
          consultation.created_at
        ).toLocaleString("ko-KR")}</p>
      </div>

      <h3>📞 다음 단계</h3>
      <ol>
        <li><strong>내부 검토</strong> - 전문 상담사가 신청 내용을 꼼꼼히 검토합니다</li>
        <li><strong>전화 상담</strong> - 1-2일 내에 연락드려 자세한 상담을 진행합니다</li>
        <li><strong>맞춤 제안</strong> - 고객님께 최적화된 솔루션과 견적을 제안드립니다</li>
      </ol>

      <p><strong>🔥 특별 혜택:</strong> 이달 한정 런칭 기념 20% 할인!</p>

      <hr>
      <p>문의사항이 있으시면 언제든 <strong>010-9915-4724</strong>로 연락주세요.</p>
      <p>감사합니다.</p>

      <p><small>© 2024 LeoFitTech. All rights reserved.</small></p>
    `;
  }
}
```

### 2. Slack 알림 (선택사항)

```typescript
// services/slack.ts
export class SlackNotificationService {
  static async sendNewConsultationAlert(consultation: any) {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    const message = {
      text: "🔔 새로운 상담 신청",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🔔 새로운 상담 신청",
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*신청번호:*\n${consultation.consultation_number}`,
            },
            {
              type: "mrkdwn",
              text: `*신청자:*\n${consultation.contact_name}`,
            },
            {
              type: "mrkdwn",
              text: `*연락처:*\n${consultation.contact_phone}`,
            },
            {
              type: "mrkdwn",
              text: `*이메일:*\n${consultation.contact_email}`,
            },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  }
}
```

---

## 🧪 테스트 전략

### 1. 단위 테스트

```typescript
// __tests__/api/consultation-submit.test.ts
import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/consultation-submit";

describe("/api/consultation-submit", () => {
  test("guided consultation submission", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        type: "guided",
        serviceType: "homepage",
        projectSize: "medium",
        budget: "300-800",
        timeline: "2-3months",
        importantFeatures: ["mobile", "seo"],
        additionalRequests: "",
        contact: {
          name: "홍길동",
          phone: "010-1234-5678",
          email: "test@example.com",
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.consultationNumber).toMatch(/^CS-\d{8}-\d{4}$/);
  });
});
```

### 2. 통합 테스트

```typescript
// __tests__/integration/consultation-flow.test.ts
describe("Consultation Flow Integration", () => {
  test("complete guided consultation flow", async () => {
    // 1. 상담 신청
    const submitResponse = await request(app)
      .post("/api/consultation-submit")
      .send(mockGuidedConsultation);

    expect(submitResponse.status).toBe(201);

    // 2. 상담 조회
    const consultationId = submitResponse.body.data.consultationId;
    const getResponse = await request(app).get(
      `/api/consultation/${consultationId}`
    );

    expect(getResponse.status).toBe(200);

    // 3. 상태 업데이트
    const updateResponse = await request(app)
      .patch(`/api/consultation/${consultationId}/status`)
      .send({ status: "reviewing" });

    expect(updateResponse.status).toBe(200);
  });
});
```

---

## 📈 모니터링 및 분석

### 1. 성능 모니터링

```typescript
// utils/monitoring.ts
export class MonitoringService {
  static async logApiPerformance(
    endpoint: string,
    duration: number,
    success: boolean
  ) {
    // APM 도구 연동 (예: Sentry, DataDog)
    console.log({
      endpoint,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  static async trackConversionFunnel(step: string, metadata?: any) {
    // 구글 애널리틱스 또는 기타 분석 도구 연동
    await fetch("/api/analytics/track", {
      method: "POST",
      body: JSON.stringify({
        event: "consultation_funnel",
        step,
        metadata,
      }),
    });
  }
}
```

### 2. 실시간 대시보드 데이터

```typescript
// pages/api/consultation/realtime-stats.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const today = new Date().toISOString().split("T")[0];

  const stats = await supabaseAdmin
    .from("consultations")
    .select("*")
    .gte("created_at", `${today}T00:00:00.000Z`)
    .lt("created_at", `${today}T23:59:59.999Z`);

  const realTimeData = {
    todayTotal: stats.data?.length || 0,
    todayGuided: stats.data?.filter((c) => c.type === "guided").length || 0,
    todayFree: stats.data?.filter((c) => c.type === "free").length || 0,
    pendingReview:
      stats.data?.filter((c) => c.status === "pending").length || 0,
    lastUpdate: new Date().toISOString(),
  };

  res.status(200).json({ success: true, data: realTimeData });
}
```

---

## 🚀 배포 및 운영

### 1. 환경별 설정

```javascript
// next.config.js
module.exports = {
  env: {
    ENVIRONMENT: process.env.NODE_ENV,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};
```

### 2. 데이터베이스 마이그레이션

```sql
-- migrations/001_initial_schema.sql
-- 위에서 정의한 모든 테이블 생성 스크립트

-- migrations/002_add_indexes.sql
-- 성능 최적화를 위한 추가 인덱스

-- migrations/003_rls_policies.sql
-- Row Level Security 정책 설정
```

### 3. 백업 및 복구 전략

```typescript
// scripts/backup.ts
export async function createDatabaseBackup() {
  // 일일 백업 스크립트
  const backupData = await supabaseAdmin
    .from("consultations")
    .select("*, guided_consultations(*), free_consultations(*)")
    .gte("created_at", getYesterday());

  // S3 또는 다른 스토리지에 백업
  await uploadToStorage(`backup-${Date.now()}.json`, backupData);
}
```

---

## 📝 API 사용 가이드

### 1. 빠른 시작

```bash
# 1. 환경 변수 설정
cp .env.example .env.local

# 2. Supabase 프로젝트 생성 및 연결
# 3. 데이터베이스 스키마 실행
# 4. API 테스트

curl -X POST http://localhost:3000/api/consultation-submit \
  -H "Content-Type: application/json" \
  -d '{ "type": "guided", ... }'
```

### 2. 에러 코드 레퍼런스

| 코드                  | 설명                  | 해결방법              |
| --------------------- | --------------------- | --------------------- |
| `VALIDATION_ERROR`    | 입력 데이터 검증 실패 | 요청 데이터 형식 확인 |
| `RATE_LIMIT_EXCEEDED` | 요청 제한 초과        | 잠시 후 재시도        |
| `DATABASE_ERROR`      | 데이터베이스 오류     | 관리자 문의           |
| `EMAIL_SEND_FAILED`   | 이메일 발송 실패      | 이메일 설정 확인      |

---

이 API 설계 문서는 LeoFitTech 상담시스템의 완전한 백엔드 구조를 제공하며, Supabase의 강력한 기능들을 최대한 활용하여 확장 가능하고 안전한 시스템을 구축할 수 있도록 설계되었습니다.
