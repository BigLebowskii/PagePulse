// ============================================
// PagePulse Database Types
// Mirrors our Supabase schema for type safety
// ============================================

export type Plan = "free" | "starter" | "growth" | "agency";
export type AuditStatus = "pending" | "running" | "completed" | "failed";

// ----- Audit Results (JSONB) -----
export interface AuditResults {
  broken_links: {
    score: number;
    total_links: number;
    broken_count: number;
    broken_links: {
      url: string;
      status_code: number;
      found_on: string;
    }[];
  };
  alt_text: {
    score: number;
    total_images: number;
    missing_alt: number;
    images: {
      src: string;
      has_alt: boolean;
      found_on: string;
    }[];
  };
  page_speed: {
    score: number;
    load_time_ms: number;
    first_contentful_paint: number;
    largest_contentful_paint: number;
    recommendations: string[];
  };
  meta_tags: {
    score: number;
    has_title: boolean;
    title_length: number;
    has_description: boolean;
    description_length: number;
    has_og_tags: boolean;
    missing_tags: string[];
  };
  mobile_friendly: {
    score: number;
    is_responsive: boolean;
    viewport_set: boolean;
    issues: string[];
  };
  headings: {
    score: number;
    has_h1: boolean;
    h1_count: number;
    structure: string[];
    issues: string[];
  };
}

// ----- Supabase Database type (matches @supabase/supabase-js expected format) -----
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: Plan;
          lemonsqueezy_customer_id: string | null;
          lemonsqueezy_subscription_id: string | null;
          audits_used_this_month: number;
          audits_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: Plan;
          lemonsqueezy_customer_id?: string | null;
          lemonsqueezy_subscription_id?: string | null;
          audits_used_this_month?: number;
          audits_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: Plan;
          lemonsqueezy_customer_id?: string | null;
          lemonsqueezy_subscription_id?: string | null;
          audits_used_this_month?: number;
          audits_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audits: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          status: AuditStatus;
          overall_score: number | null;
          results: AuditResults | null;
          pdf_url: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          status?: AuditStatus;
          overall_score?: number | null;
          results?: AuditResults | null;
          pdf_url?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          status?: AuditStatus;
          overall_score?: number | null;
          results?: AuditResults | null;
          pdf_url?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audits_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ----- Helper types for use in components -----
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Audit = Database["public"]["Tables"]["audits"]["Row"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Row"];
