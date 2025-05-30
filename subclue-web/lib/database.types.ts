export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assinantes: {
        Row: {
          cpf: string | null
          created_at: string | null
          current_period_end: string | null
          data_nascimento: string | null
          id: string
          nome_completo: string | null
          status: string | null
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          current_period_end?: string | null
          data_nascimento?: string | null
          id?: string
          nome_completo?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          current_period_end?: string | null
          data_nascimento?: string | null
          id?: string
          nome_completo?: string | null
          status?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dispute_messages: {
        Row: {
          body: string | null
          created_at: string | null
          dispute_id: number | null
          id: number
          sender_role: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          dispute_id?: number | null
          id?: number
          sender_role?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          dispute_id?: number | null
          id?: number
          sender_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_files: {
        Row: {
          dispute_id: number | null
          id: number
          uploaded_at: string | null
          url: string | null
        }
        Insert: {
          dispute_id?: number | null
          id?: number
          uploaded_at?: string | null
          url?: string | null
        }
        Update: {
          dispute_id?: number | null
          id?: number
          uploaded_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_files_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_spot: {
        Row: {
          highlighted_at: string | null
          produto_id: string
        }
        Insert: {
          highlighted_at?: string | null
          produto_id: string
        }
        Update: {
          highlighted_at?: string | null
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_spot_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: true
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros: {
        Row: {
          charges_enabled: boolean | null
          comissao_pct: number
          company_name: string | null
          created_at: string | null
          id: string
          nome: string
          owner_id: string | null
          phone: string | null
          plano: string
          slug: string | null
          stripe_account_id: string | null
          tax_id: string | null
          website_url: string | null
        }
        Insert: {
          charges_enabled?: boolean | null
          comissao_pct?: number
          company_name?: string | null
          created_at?: string | null
          id?: string
          nome: string
          owner_id?: string | null
          phone?: string | null
          plano: string
          slug?: string | null
          stripe_account_id?: string | null
          tax_id?: string | null
          website_url?: string | null
        }
        Update: {
          charges_enabled?: boolean | null
          comissao_pct?: number
          company_name?: string | null
          created_at?: string | null
          id?: string
          nome?: string
          owner_id?: string | null
          phone?: string | null
          plano?: string
          slug?: string | null
          stripe_account_id?: string | null
          tax_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          created_at: string | null
          currency: string | null
          id: number
          parceiro_id: string | null
          scheduled_for: string | null
          status: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: number
          parceiro_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: number
          parceiro_id?: string | null
          scheduled_for?: string | null
          status?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      periodos: {
        Row: {
          id: number
          multiplicador: number
          periodicidade: string | null
          produto_id: string | null
        }
        Insert: {
          id?: number
          multiplicador?: number
          periodicidade?: string | null
          produto_id?: string | null
        }
        Update: {
          id?: number
          multiplicador?: number
          periodicidade?: string | null
          produto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "periodos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_parceiro: {
        Row: {
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          notificacao_renovacao_enviada: boolean
          parceiro_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim: string
          data_inicio?: string
          id?: string
          notificacao_renovacao_enviada?: boolean
          parceiro_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          notificacao_renovacao_enviada?: boolean
          parceiro_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_parceiro_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          currency: string | null
          descricao: string | null
          id: string
          media_iframe: string | null
          parceiro_id: string | null
          preco_cents: number
          promo_code: string | null
          reviewed: boolean | null
          slug: string | null
          titulo: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          currency?: string | null
          descricao?: string | null
          id?: string
          media_iframe?: string | null
          parceiro_id?: string | null
          preco_cents: number
          promo_code?: string | null
          reviewed?: boolean | null
          slug?: string | null
          titulo: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          currency?: string | null
          descricao?: string | null
          id?: string
          media_iframe?: string | null
          parceiro_id?: string | null
          preco_cents?: number
          promo_code?: string | null
          reviewed?: boolean | null
          slug?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_parceiro: {
        Row: {
          assinante_id: string
          comentario: string | null
          criado_em: string
          id: string
          nota: number
          parceiro_id: string
        }
        Insert: {
          assinante_id: string
          comentario?: string | null
          criado_em?: string
          id?: string
          nota: number
          parceiro_id: string
        }
        Update: {
          assinante_id?: string
          comentario?: string | null
          criado_em?: string
          id?: string
          nota?: number
          parceiro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_parceiro_assinante_id_fkey"
            columns: ["assinante_id"]
            isOneToOne: false
            referencedRelation: "assinantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_parceiro_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_produto: {
        Row: {
          assinante_id: string
          comentario: string | null
          criado_em: string
          id: string
          nota: number
          produto_id: string
        }
        Insert: {
          assinante_id: string
          comentario?: string | null
          criado_em?: string
          id?: string
          nota: number
          produto_id: string
        }
        Update: {
          assinante_id?: string
          comentario?: string | null
          criado_em?: string
          id?: string
          nota?: number
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_produto_assinante_id_fkey"
            columns: ["assinante_id"]
            isOneToOne: false
            referencedRelation: "assinantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_produto_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assunto: string | null
          created_at: string | null
          id: number
          sla_due_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          assunto?: string | null
          created_at?: string | null
          id?: number
          sla_due_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          assunto?: string | null
          created_at?: string | null
          id?: number
          sla_due_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          application_fee: number | null
          assinatura_id: string | null
          created_at: string | null
          currency: string | null
          id: number
          valor_bruto: number | null
          valor_liq: number | null
        }
        Insert: {
          application_fee?: number | null
          assinatura_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: number
          valor_bruto?: number | null
          valor_liq?: number | null
        }
        Update: {
          application_fee?: number | null
          assinatura_id?: string | null
          created_at?: string | null
          currency?: string | null
          id?: number
          valor_bruto?: number | null
          valor_liq?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinantes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_planos_a_vencer: {
        Row: {
          data_vencimento: string | null
          email: string | null
          nome_parceiro: string | null
          notificacao_renovacao_enviada: boolean | null
          plano_id: string | null
        }
        Relationships: []
      }
      vw_ratings_parceiro: {
        Row: {
          media: number | null
          parceiro_id: string | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_parceiro_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_ratings_produto: {
        Row: {
          media: number | null
          produto_id: string | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_produto_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      slugify: {
        Args: { src: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
