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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      authorized_users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      documents_google: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      event_images: {
        Row: {
          caption: string | null
          created_at: string
          event_id: string
          id: string
          image_name: string
          image_url: string
          is_public: boolean
          likes_count: number
          media_type: string | null
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          event_id: string
          id?: string
          image_name: string
          image_url: string
          is_public?: boolean
          likes_count?: number
          media_type?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          event_id?: string
          id?: string
          image_name?: string
          image_url?: string
          is_public?: boolean
          likes_count?: number
          media_type?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_images_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_name: string
          event_type: string
          event_year: number
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_name: string
          event_type: string
          event_year: number
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_name?: string
          event_type?: string
          event_year?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_likes: {
        Row: {
          created_at: string
          id: string
          media_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_likes_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "event_images"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories_tg: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      n8n_chat_histories_web: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_authorized_user:
        | { Args: never; Returns: boolean }
        | {
            Args: { check_role?: Database["public"]["Enums"]["user_role"] }
            Returns: boolean
          }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_google: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "user"
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
    Enums: {
      user_role: ["admin", "user"],
    },
  },
} as const
