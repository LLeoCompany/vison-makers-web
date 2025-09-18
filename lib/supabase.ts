// Supabase Client Configuration
// VisionMakers - Direct Supabase Communication Setup

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Public client for anonymous operations (consultation submissions)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    enabled: false, // 실시간 기능 비활성화 (성능 최적화)
  },
});

// Admin client with service role key for admin operations
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  realtime: {
    enabled: false,
  },
});

// Client-side authenticated client for admin dashboard
export const createAuthenticatedClient = (accessToken: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
};

// Configuration constants
export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  tables: {
    consultations: 'consultations',
    guidedConsultations: 'guided_consultations',
    freeConsultations: 'free_consultations',
    adminUsers: 'admin_users',
    userSessions: 'user_sessions',
    consultationLogs: 'consultation_logs',
    apiLogs: 'api_logs',
    systemConfigs: 'system_configs',
    consultationStats: 'consultation_stats',
  },
  views: {
    consultationDetails: 'consultation_details',
    consultationStatusCounts: 'consultation_status_counts',
  },
  functions: {
    isAdmin: 'is_admin',
    hasPermission: 'has_permission',
    canAccessConsultation: 'can_access_consultation',
  },
} as const;

// Error handling for Supabase operations
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

// Helper function to handle Supabase responses
export function handleSupabaseResponse<T>(response: {
  data: T | null;
  error: any;
}): T {
  if (response.error) {
    throw new SupabaseError(
      response.error.message,
      response.error.code,
      response.error.details,
      response.error.hint
    );
  }

  if (response.data === null) {
    throw new SupabaseError('No data returned from Supabase');
  }

  return response.data;
}

// Type-safe query builder helper
export const createQuery = <T>(table: keyof typeof SUPABASE_CONFIG.tables) => {
  return {
    select: (columns = '*') => supabase.from(SUPABASE_CONFIG.tables[table]).select(columns),
    insert: (data: any) => supabase.from(SUPABASE_CONFIG.tables[table]).insert(data),
    update: (data: any) => supabase.from(SUPABASE_CONFIG.tables[table]).update(data),
    delete: () => supabase.from(SUPABASE_CONFIG.tables[table]).delete(),
    upsert: (data: any) => supabase.from(SUPABASE_CONFIG.tables[table]).upsert(data),
  };
};

// Admin query builder (bypasses RLS)
export const createAdminQuery = <T>(table: keyof typeof SUPABASE_CONFIG.tables) => {
  return {
    select: (columns = '*') => supabaseAdmin.from(SUPABASE_CONFIG.tables[table]).select(columns),
    insert: (data: any) => supabaseAdmin.from(SUPABASE_CONFIG.tables[table]).insert(data),
    update: (data: any) => supabaseAdmin.from(SUPABASE_CONFIG.tables[table]).update(data),
    delete: () => supabaseAdmin.from(SUPABASE_CONFIG.tables[table]).delete(),
    upsert: (data: any) => supabaseAdmin.from(SUPABASE_CONFIG.tables[table]).upsert(data),
  };
};

// Database health check
export async function checkSupabaseHealth() {
  try {
    const start = Date.now();
    const { data, error } = await supabase
      .from('system_configs')
      .select('config_key')
      .limit(1);

    const duration = Date.now() - start;

    return {
      connected: !error,
      responseTime: duration,
      error: error?.message,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      connected: false,
      responseTime: -1,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}

export default supabase;