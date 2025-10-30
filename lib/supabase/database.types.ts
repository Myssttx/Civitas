// Auto-generated Supabase types
// Run: npx supabase gen types typescript --project-id your-project-id > lib/supabase/database.types.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          email: string;
          display_name: string | null;
          photo_url: string | null;
          roles: string[];
          language: string;
          accessibility_profile: Json | null;
          last_known_building_id: string | null;
          notify_critical_only: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

