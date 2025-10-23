export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      emissions: {
        Row: {
          amount: number
          category: string
          co2e_kg: number
          consensus_timestamp: string | null
          created_at: string | null
          date: string
          description: string | null
          emission_type: string
          hedera_transaction_id: string | null
          id: string
          topic_id: string | null
          unit: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          co2e_kg: number
          consensus_timestamp?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          emission_type: string
          hedera_transaction_id?: string | null
          id?: string
          topic_id?: string | null
          unit: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          co2e_kg?: number
          consensus_timestamp?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          emission_type?: string
          hedera_transaction_id?: string | null
          id?: string
          topic_id?: string | null
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
      offset_projects: {
        Row: {
          available_credits: number
          cost_per_kg: number
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          location: string
          name: string
          project_id: string
          project_type: string
          updated_at: string | null
          verification_standard: string
        }
        Insert: {
          available_credits: number
          cost_per_kg: number
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          location: string
          name: string
          project_id: string
          project_type: string
          updated_at?: string | null
          verification_standard: string
        }
        Update: {
          available_credits?: number
          cost_per_kg?: number
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string
          name?: string
          project_id?: string
          project_type?: string
          updated_at?: string | null
          verification_standard?: string
        }
        Relationships: []
      }
      offset_purchases: {
        Row: {
          created_at: string | null
          hedera_transaction_id: string | null
          id: string
          project_id: string
          quantity: number
          status: string | null
          token_id: string | null
          token_mint_transaction_id: string | null
          total_co2e_kg: number
          total_hbar_cost: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          hedera_transaction_id?: string | null
          id?: string
          project_id: string
          quantity: number
          status?: string | null
          token_id?: string | null
          token_mint_transaction_id?: string | null
          total_co2e_kg: number
          total_hbar_cost: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          hedera_transaction_id?: string | null
          id?: string
          project_id?: string
          quantity?: number
          status?: string | null
          token_id?: string | null
          token_mint_transaction_id?: string | null
          total_co2e_kg?: number
          total_hbar_cost?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offset_purchases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "offset_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string | null
          first_name: string
          hedera_account_id: string | null
          id: string
          last_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          first_name: string
          hedera_account_id?: string | null
          id?: string
          last_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          first_name?: string
          hedera_account_id?: string | null
          id?: string
          last_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_offset_balances: {
        Row: {
          id: string
          last_updated: string | null
          project_id: string
          token_balance: number
          total_kg_co2e: number
          user_id: string
        }
        Insert: {
          id?: string
          last_updated?: string | null
          project_id: string
          token_balance?: number
          total_kg_co2e?: number
          user_id: string
        }
        Update: {
          id?: string
          last_updated?: string | null
          project_id?: string
          token_balance?: number
          total_kg_co2e?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_offset_balances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "offset_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
