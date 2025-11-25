// Consultation Service Layer
// LeoFitTech - Direct Supabase Communication

import {
  supabase,
  supabaseAdmin,
  handleSupabaseResponse,
  SupabaseError,
  SUPABASE_CONFIG,
} from "@/lib/supabase";
import type {
  ConsultationRow,
  ConsultationInsert,
  ConsultationUpdate,
  GuidedConsultationForm,
  FreeConsultationForm,
  GuidedConsultationInsert,
  FreeConsultationInsert,
  ConsultationDetailsView,
  ApiResponse,
  ServiceType,
  ProjectSize,
  BudgetRange,
  Timeline,
  ConsultationStatus,
  ConsultationPriority,
} from "@/types/database";

// Consultation number generation
export async function generateConsultationNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

  // Get today's count
  const { data: todayCount } = await supabaseAdmin
    .from("consultations")
    .select("count")
    .gte("created_at", `${today.toISOString().slice(0, 10)}T00:00:00.000Z`)
    .lt("created_at", `${today.toISOString().slice(0, 10)}T23:59:59.999Z`);

  const count = (todayCount?.length || 0) + 1;
  return `CON-${dateStr}-${count.toString().padStart(3, "0")}`;
}

// Create guided consultation
export async function createGuidedConsultation(
  formData: GuidedConsultationForm,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrerUrl?: string;
  }
): Promise<
  ApiResponse<{ consultationId: string; consultationNumber: string }>
> {
  try {
    const consultationNumber = await generateConsultationNumber();

    // Create main consultation record
    const consultationData: ConsultationInsert = {
      consultation_number: consultationNumber,
      type: "guided",
      status: "pending",
      priority: "normal",
      contact_name: formData.contact_name,
      contact_phone: formData.contact_phone,
      contact_email: formData.contact_email,
      contact_company: formData.contact_company || null,
      preferred_contact_time: formData.preferred_contact_time || null,
      utm_source: formData.utm_source || null,
      utm_medium: formData.utm_medium || null,
      utm_campaign: formData.utm_campaign || null,
      user_agent: metadata?.userAgent || null,
      ip_address: metadata?.ipAddress || null,
      referrer_url: metadata?.referrerUrl || null,
      metadata: {},
    };

    const consultationResponse = await supabase
      .from("consultations")
      .insert(consultationData)
      .select()
      .single();

    const consultation = handleSupabaseResponse(consultationResponse);

    // Create guided consultation details
    const guidedData: GuidedConsultationInsert = {
      consultation_id: consultation.id,
      service_type: formData.service_type,
      project_size: formData.project_size,
      budget: formData.budget,
      timeline: formData.timeline,
      important_features: formData.important_features || [],
      additional_requests: formData.additional_requests || null,
    };

    const guidedResponse = await supabase
      .from("guided_consultations")
      .insert(guidedData);

    handleSupabaseResponse(guidedResponse);

    return {
      success: true,
      data: {
        consultationId: consultation.id,
        consultationNumber: consultation.consultation_number,
      },
    };
  } catch (error) {
    console.error("Error creating guided consultation:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "CONSULTATION_CREATE_ERROR",
          message: error.message,
          details: error.details,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create consultation",
      },
    };
  }
}

// Create free consultation
export async function createFreeConsultation(
  formData: FreeConsultationForm,
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrerUrl?: string;
  }
): Promise<
  ApiResponse<{ consultationId: string; consultationNumber: string }>
> {
  try {
    const consultationNumber = await generateConsultationNumber();

    // Create main consultation record
    const consultationData: ConsultationInsert = {
      consultation_number: consultationNumber,
      type: "free",
      status: "pending",
      priority: "normal",
      contact_name: formData.contact_name,
      contact_phone: formData.contact_phone,
      contact_email: formData.contact_email,
      contact_company: formData.contact_company || null,
      preferred_contact_time: formData.preferred_contact_time || null,
      utm_source: formData.utm_source || null,
      utm_medium: formData.utm_medium || null,
      utm_campaign: formData.utm_campaign || null,
      user_agent: metadata?.userAgent || null,
      ip_address: metadata?.ipAddress || null,
      referrer_url: metadata?.referrerUrl || null,
      metadata: {},
    };

    const consultationResponse = await supabase
      .from("consultations")
      .insert(consultationData)
      .select()
      .single();

    const consultation = handleSupabaseResponse(consultationResponse);

    // Create free consultation details
    const freeData: FreeConsultationInsert = {
      consultation_id: consultation.id,
      project_description: formData.project_description,
      budget_range: formData.budget_range || null,
      timeline_preference: formData.timeline_preference || null,
    };

    const freeResponse = await supabase
      .from("free_consultations")
      .insert(freeData);

    handleSupabaseResponse(freeResponse);

    return {
      success: true,
      data: {
        consultationId: consultation.id,
        consultationNumber: consultation.consultation_number,
      },
    };
  } catch (error) {
    console.error("Error creating free consultation:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "CONSULTATION_CREATE_ERROR",
          message: error.message,
          details: error.details,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create consultation",
      },
    };
  }
}

// Get consultation by ID (Admin only)
export async function getConsultationById(
  id: string,
  useAdmin = false
): Promise<ApiResponse<ConsultationDetailsView>> {
  try {
    const client = useAdmin ? supabaseAdmin : supabase;

    const response = await client
      .from("consultation_details")
      .select("*")
      .eq("id", id)
      .single();

    const consultation = handleSupabaseResponse(response);

    return {
      success: true,
      data: consultation,
    };
  } catch (error) {
    console.error("Error getting consultation:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "CONSULTATION_NOT_FOUND",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to get consultation",
      },
    };
  }
}

// Get consultations list (Admin only)
export async function getConsultations({
  page = 1,
  limit = 20,
  status,
  type,
  priority,
  startDate,
  endDate,
  search,
}: {
  page?: number;
  limit?: number;
  status?: ConsultationStatus;
  type?: "guided" | "free";
  priority?: ConsultationPriority;
  startDate?: string;
  endDate?: string;
  search?: string;
} = {}): Promise<
  ApiResponse<{
    consultations: ConsultationDetailsView[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> {
  try {
    let query = supabaseAdmin
      .from("consultation_details")
      .select("*", { count: "exact" });

    // Apply filters
    if (status) {
      query = query.eq("status", status);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (priority) {
      query = query.eq("priority", priority);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    if (search) {
      query = query.or(
        `contact_name.ilike.%${search}%,contact_email.ilike.%${search}%,contact_company.ilike.%${search}%,consultation_number.ilike.%${search}%`
      );
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const response = await query;
    const data = handleSupabaseResponse(response);

    const total = response.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        consultations: data,
        total,
        page,
        limit,
        totalPages,
      },
      meta: {
        total,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error getting consultations:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "CONSULTATIONS_FETCH_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to get consultations",
      },
    };
  }
}

// Update consultation status (Admin only)
export async function updateConsultationStatus(
  id: string,
  status: ConsultationStatus,
  assignedTo?: string
): Promise<ApiResponse<ConsultationRow>> {
  try {
    const updateData: ConsultationUpdate = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (assignedTo) {
      updateData.assigned_to = assignedTo;
      updateData.assigned_at = new Date().toISOString();
    }

    if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    const response = await supabaseAdmin
      .from("consultations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    const consultation = handleSupabaseResponse(response);

    return {
      success: true,
      data: consultation,
    };
  } catch (error) {
    console.error("Error updating consultation status:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "CONSULTATION_UPDATE_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update consultation status",
      },
    };
  }
}

// Get consultation statistics (Admin only)
export async function getConsultationStats(): Promise<
  ApiResponse<{
    total: number;
    pending: number;
    contacted: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    guided: number;
    free: number;
    today: number;
    this_week: number;
    this_month: number;
  }>
> {
  try {
    // Get overall counts
    const { data: statusCounts } = await supabaseAdmin
      .from("consultation_status_counts")
      .select("*");

    // Get type counts
    const { data: typeCounts } = await supabaseAdmin
      .from("consultations")
      .select("type")
      .neq("status", "cancelled");

    // Get time-based counts
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const weekStart = new Date(
      todayStart.getTime() - today.getDay() * 24 * 60 * 60 * 1000
    );
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayResult, weekResult, monthResult] = await Promise.all([
      supabaseAdmin
        .from("consultations")
        .select("id", { count: "exact" })
        .gte("created_at", todayStart.toISOString()),
      supabaseAdmin
        .from("consultations")
        .select("id", { count: "exact" })
        .gte("created_at", weekStart.toISOString()),
      supabaseAdmin
        .from("consultations")
        .select("id", { count: "exact" })
        .gte("created_at", monthStart.toISOString()),
    ]);

    const statusMap = (statusCounts || []).reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const typeMap = (typeCounts || []).reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        total: Object.values(statusMap).reduce((sum, count) => sum + count, 0),
        pending: statusMap.pending || 0,
        contacted: statusMap.contacted || 0,
        in_progress: statusMap.in_progress || 0,
        completed: statusMap.completed || 0,
        cancelled: statusMap.cancelled || 0,
        guided: typeMap.guided || 0,
        free: typeMap.free || 0,
        today: todayResult.count || 0,
        this_week: weekResult.count || 0,
        this_month: monthResult.count || 0,
      },
    };
  } catch (error) {
    console.error("Error getting consultation stats:", error);

    if (error instanceof SupabaseError) {
      return {
        success: false,
        error: {
          code: error.code || "STATS_FETCH_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to get consultation statistics",
      },
    };
  }
}

// Validate consultation data
export function validateGuidedConsultationForm(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!data.contact_name?.trim()) {
    errors.push("연락처 이름은 필수입니다.");
  }
  if (!data.contact_phone?.trim()) {
    errors.push("연락처 전화번호는 필수입니다.");
  }
  if (!data.contact_email?.trim()) {
    errors.push("연락처 이메일은 필수입니다.");
  }
  if (!data.service_type) {
    errors.push("서비스 타입은 필수입니다.");
  }
  if (!data.project_size) {
    errors.push("프로젝트 규모는 필수입니다.");
  }
  if (!data.budget) {
    errors.push("예산 범위는 필수입니다.");
  }
  if (!data.timeline) {
    errors.push("타임라인은 필수입니다.");
  }

  // Email validation
  if (
    data.contact_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)
  ) {
    errors.push("올바른 이메일 형식이 아닙니다.");
  }

  // Phone validation (Korean format)
  if (data.contact_phone && !/^[\d\-\+\(\)\s]+$/.test(data.contact_phone)) {
    errors.push("올바른 전화번호 형식이 아닙니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateFreeConsultationForm(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!data.contact_name?.trim()) {
    errors.push("연락처 이름은 필수입니다.");
  }
  if (!data.contact_phone?.trim()) {
    errors.push("연락처 전화번호는 필수입니다.");
  }
  if (!data.contact_email?.trim()) {
    errors.push("연락처 이메일은 필수입니다.");
  }
  if (!data.project_description?.trim()) {
    errors.push("프로젝트 설명은 필수입니다.");
  }

  // Email validation
  if (
    data.contact_email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)
  ) {
    errors.push("올바른 이메일 형식이 아닙니다.");
  }

  // Phone validation
  if (data.contact_phone && !/^[\d\-\+\(\)\s]+$/.test(data.contact_phone)) {
    errors.push("올바른 전화번호 형식이 아닙니다.");
  }

  // Description length
  if (data.project_description && data.project_description.length < 10) {
    errors.push("프로젝트 설명은 최소 10자 이상이어야 합니다.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
