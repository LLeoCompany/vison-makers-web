// Database Types - Generated from Supabase Schema
// VisionMakers Consultation System

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ENUM Types
export type ConsultationType = 'guided' | 'free';

export type ConsultationStatus =
  | 'pending'
  | 'contacted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type ConsultationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type ContactTimePreference = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type ServiceType =
  | 'web_development'
  | 'mobile_app'
  | 'desktop_app'
  | 'ai_ml'
  | 'blockchain'
  | 'iot'
  | 'consulting'
  | 'maintenance'
  | 'other';

export type ProjectSize = 'small' | 'medium' | 'large' | 'enterprise';

export type BudgetRange =
  | 'under_1000'
  | '1000_to_3000'
  | '3000_to_5000'
  | '5000_to_10000'
  | 'over_10000'
  | 'negotiable';

export type Timeline =
  | 'asap'
  | '1_month'
  | '1_3_months'
  | '3_6_months'
  | '6_12_months'
  | 'over_1_year'
  | 'flexible';

export type AdminRole = 'admin' | 'manager' | 'viewer';

export type ConsultationAction =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'assigned'
  | 'contacted'
  | 'completed'
  | 'cancelled'
  | 'note_added';

export type ActorType = 'system' | 'admin' | 'api';

export type ConfigType = 'string' | 'number' | 'boolean' | 'json' | 'array';

// Database Schema Interface
export interface Database {
  public: {
    Tables: {
      consultations: {
        Row: {
          id: string;
          consultation_number: string;
          type: ConsultationType;
          status: ConsultationStatus;
          priority: ConsultationPriority;
          contact_name: string;
          contact_phone: string;
          contact_email: string;
          contact_company: string | null;
          preferred_contact_time: ContactTimePreference | null;
          user_agent: string | null;
          ip_address: string | null;
          referrer_url: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          created_at: string;
          updated_at: string;
          assigned_at: string | null;
          completed_at: string | null;
          assigned_to: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          consultation_number: string;
          type: ConsultationType;
          status?: ConsultationStatus;
          priority?: ConsultationPriority;
          contact_name: string;
          contact_phone: string;
          contact_email: string;
          contact_company?: string | null;
          preferred_contact_time?: ContactTimePreference | null;
          user_agent?: string | null;
          ip_address?: string | null;
          referrer_url?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          created_at?: string;
          updated_at?: string;
          assigned_at?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          consultation_number?: string;
          type?: ConsultationType;
          status?: ConsultationStatus;
          priority?: ConsultationPriority;
          contact_name?: string;
          contact_phone?: string;
          contact_email?: string;
          contact_company?: string | null;
          preferred_contact_time?: ContactTimePreference | null;
          user_agent?: string | null;
          ip_address?: string | null;
          referrer_url?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          created_at?: string;
          updated_at?: string;
          assigned_at?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          metadata?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'consultations_assigned_to_fkey';
            columns: ['assigned_to'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      guided_consultations: {
        Row: {
          id: string;
          consultation_id: string;
          service_type: ServiceType;
          project_size: ProjectSize;
          budget: BudgetRange;
          timeline: Timeline;
          important_features: string[];
          additional_requests: string | null;
          estimated_budget_min: number | null;
          estimated_budget_max: number | null;
          estimated_duration_months: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          service_type: ServiceType;
          project_size: ProjectSize;
          budget: BudgetRange;
          timeline: Timeline;
          important_features?: string[];
          additional_requests?: string | null;
          estimated_budget_min?: number | null;
          estimated_budget_max?: number | null;
          estimated_duration_months?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          service_type?: ServiceType;
          project_size?: ProjectSize;
          budget?: BudgetRange;
          timeline?: Timeline;
          important_features?: string[];
          additional_requests?: string | null;
          estimated_budget_min?: number | null;
          estimated_budget_max?: number | null;
          estimated_duration_months?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'guided_consultations_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: true;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          }
        ];
      };
      free_consultations: {
        Row: {
          id: string;
          consultation_id: string;
          project_description: string;
          budget_range: string | null;
          timeline_preference: string | null;
          analyzed_keywords: string[] | null;
          complexity_score: number | null;
          recommended_service_type: ServiceType | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          project_description: string;
          budget_range?: string | null;
          timeline_preference?: string | null;
          analyzed_keywords?: string[] | null;
          complexity_score?: number | null;
          recommended_service_type?: ServiceType | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          project_description?: string;
          budget_range?: string | null;
          timeline_preference?: string | null;
          analyzed_keywords?: string[] | null;
          complexity_score?: number | null;
          recommended_service_type?: ServiceType | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'free_consultations_consultation_id_fkey';
            columns: ['consultation_id'];
            isOneToOne: true;
            referencedRelation: 'consultations';
            referencedColumns: ['id'];
          }
        ];
      };
      admin_users: {
        Row: {
          id: string;
          username: string;
          email: string;
          password_hash: string;
          full_name: string;
          phone: string | null;
          department: string | null;
          position: string | null;
          role: AdminRole;
          permissions: string[];
          is_active: boolean;
          is_verified: boolean;
          last_login_at: string | null;
          last_login_ip: string | null;
          failed_login_attempts: number;
          locked_until: string | null;
          password_changed_at: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          password_hash: string;
          full_name: string;
          phone?: string | null;
          department?: string | null;
          position?: string | null;
          role?: AdminRole;
          permissions?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          last_login_at?: string | null;
          last_login_ip?: string | null;
          failed_login_attempts?: number;
          locked_until?: string | null;
          password_changed_at?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          password_hash?: string;
          full_name?: string;
          phone?: string | null;
          department?: string | null;
          position?: string | null;
          role?: AdminRole;
          permissions?: string[];
          is_active?: boolean;
          is_verified?: boolean;
          last_login_at?: string | null;
          last_login_ip?: string | null;
          failed_login_attempts?: number;
          locked_until?: string | null;
          password_changed_at?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_users_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      user_sessions: {
        Row: {
          id: string;
          user_id: string;
          access_token_hash: string;
          refresh_token_hash: string;
          user_agent: string | null;
          ip_address: string;
          device_info: Json;
          expires_at: string;
          is_active: boolean;
          created_at: string;
          last_accessed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          access_token_hash: string;
          refresh_token_hash: string;
          user_agent?: string | null;
          ip_address: string;
          device_info?: Json;
          expires_at: string;
          is_active?: boolean;
          created_at?: string;
          last_accessed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          access_token_hash?: string;
          refresh_token_hash?: string;
          user_agent?: string | null;
          ip_address?: string;
          device_info?: Json;
          expires_at?: string;
          is_active?: boolean;
          created_at?: string;
          last_accessed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_sessions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
      system_configs: {
        Row: {
          id: string;
          config_key: string;
          config_value: Json;
          config_type: ConfigType;
          description: string | null;
          category: string | null;
          is_public: boolean;
          is_encrypted: boolean;
          validation_rules: Json;
          default_value: Json | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          config_key: string;
          config_value: Json;
          config_type?: ConfigType;
          description?: string | null;
          category?: string | null;
          is_public?: boolean;
          is_encrypted?: boolean;
          validation_rules?: Json;
          default_value?: Json | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          config_key?: string;
          config_value?: Json;
          config_type?: ConfigType;
          description?: string | null;
          category?: string | null;
          is_public?: boolean;
          is_encrypted?: boolean;
          validation_rules?: Json;
          default_value?: Json | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'system_configs_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'admin_users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      consultation_details: {
        Row: {
          id: string;
          consultation_number: string;
          type: ConsultationType;
          status: ConsultationStatus;
          priority: ConsultationPriority;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
          contact_company: string | null;
          preferred_contact_time: ContactTimePreference | null;
          created_at: string;
          updated_at: string;
          assigned_to: string | null;
          assigned_to_name: string | null;
          service_type: ServiceType | null;
          project_size: ProjectSize | null;
          budget: BudgetRange | null;
          timeline: Timeline | null;
          important_features: string[] | null;
          additional_requests: string | null;
          project_description: string | null;
          budget_range: string | null;
          timeline_preference: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          metadata: Json;
        };
        Relationships: [];
      };
      consultation_status_counts: {
        Row: {
          status: ConsultationStatus;
          count: number;
          percentage: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: {
          user_uuid?: string;
        };
        Returns: boolean;
      };
      has_permission: {
        Args: {
          permission_name: string;
          user_uuid?: string;
        };
        Returns: boolean;
      };
      can_access_consultation: {
        Args: {
          consultation_uuid: string;
          user_uuid?: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      consultation_type: ConsultationType;
      consultation_status: ConsultationStatus;
      consultation_priority: ConsultationPriority;
      contact_time_preference: ContactTimePreference;
      service_type_enum: ServiceType;
      project_size_enum: ProjectSize;
      budget_range_enum: BudgetRange;
      timeline_enum: Timeline;
      admin_role: AdminRole;
      consultation_action: ConsultationAction;
      actor_type_enum: ActorType;
      config_type_enum: ConfigType;
    };
    CompositeTypes: {};
  };
}

// Helper types for common operations
export type ConsultationRow = Database['public']['Tables']['consultations']['Row'];
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert'];
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update'];

export type GuidedConsultationRow = Database['public']['Tables']['guided_consultations']['Row'];
export type GuidedConsultationInsert = Database['public']['Tables']['guided_consultations']['Insert'];

export type FreeConsultationRow = Database['public']['Tables']['free_consultations']['Row'];
export type FreeConsultationInsert = Database['public']['Tables']['free_consultations']['Insert'];

export type AdminUserRow = Database['public']['Tables']['admin_users']['Row'];
export type AdminUserInsert = Database['public']['Tables']['admin_users']['Insert'];

export type ConsultationDetailsView = Database['public']['Views']['consultation_details']['Row'];
export type ConsultationStatusCountsView = Database['public']['Views']['consultation_status_counts']['Row'];

// API Response Types
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

// Consultation Form Types
export interface GuidedConsultationForm {
  // Contact Information
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact_company?: string;
  preferred_contact_time?: ContactTimePreference;

  // Project Details
  service_type: ServiceType;
  project_size: ProjectSize;
  budget: BudgetRange;
  timeline: Timeline;
  important_features: string[];
  additional_requests?: string;

  // UTM Tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface FreeConsultationForm {
  // Contact Information
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  contact_company?: string;
  preferred_contact_time?: ContactTimePreference;

  // Project Details
  project_description: string;
  budget_range?: string;
  timeline_preference?: string;

  // UTM Tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export default Database;