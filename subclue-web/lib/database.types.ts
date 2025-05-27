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
          id: string
          last_active_at: string | null
          last_sign_in: string | null
          next_billing_date: string | null
          plan_ends_at: string | null
          plan_expires_at: string | null
          plan_started_at: string | null
          profile_complete: boolean
          status: Database["public"]["Enums"]["assinantes_status_enum"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          last_active_at?: string | null
          last_sign_in?: string | null
          next_billing_date?: string | null
          plan_ends_at?: string | null
          plan_expires_at?: string | null
          plan_started_at?: string | null
          profile_complete?: boolean
          status?: Database["public"]["Enums"]["assinantes_status_enum"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          last_active_at?: string | null
          last_sign_in?: string | null
          next_billing_date?: string | null
          plan_ends_at?: string | null
          plan_expires_at?: string | null
          plan_started_at?: string | null
          profile_complete?: boolean
          status?: Database["public"]["Enums"]["assinantes_status_enum"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assinaturas: {
        Row: {
          assinante_id: string
          cancelado_no_fim_periodo: boolean
          created_at: string
          data_cancelamento: string | null
          data_fim_ciclo: string | null
          data_inicio_ciclo: string | null
          data_trial_fim: string | null
          id: string
          metadata: Json | null
          plano_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          assinante_id: string
          cancelado_no_fim_periodo?: boolean
          created_at?: string
          data_cancelamento?: string | null
          data_fim_ciclo?: string | null
          data_inicio_ciclo?: string | null
          data_trial_fim?: string | null
          id?: string
          metadata?: Json | null
          plano_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          assinante_id?: string
          cancelado_no_fim_periodo?: boolean
          created_at?: string
          data_cancelamento?: string | null
          data_fim_ciclo?: string | null
          data_inicio_ciclo?: string | null
          data_trial_fim?: string | null
          id?: string
          metadata?: Json | null
          plano_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_assinante_id_fkey"
            columns: ["assinante_id"]
            isOneToOne: false
            referencedRelation: "assinantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinaturas_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_produto"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          parent_id: number | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          parent_id?: number | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          parent_id?: number | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      enderecos: {
        Row: {
          apelido: string | null
          assinante_id: string
          bairro: string
          cep: string
          cidade: string
          complemento: string | null
          created_at: string
          estado: string
          id: string
          logradouro: string
          numero: string | null
          pais: string
          principal: boolean
          updated_at: string
        }
        Insert: {
          apelido?: string | null
          assinante_id: string
          bairro: string
          cep: string
          cidade: string
          complemento?: string | null
          created_at?: string
          estado: string
          id?: string
          logradouro: string
          numero?: string | null
          pais?: string
          principal?: boolean
          updated_at?: string
        }
        Update: {
          apelido?: string | null
          assinante_id?: string
          bairro?: string
          cep?: string
          cidade?: string
          complemento?: string | null
          created_at?: string
          estado?: string
          id?: string
          logradouro?: string
          numero?: string | null
          pais?: string
          principal?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enderecos_assinante_id_fkey"
            columns: ["assinante_id"]
            isOneToOne: false
            referencedRelation: "assinantes"
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
      parceiro_zonas_permitidas: {
        Row: {
          cep_final: string | null
          cep_inicial: string | null
          cidade: string | null
          created_at: string
          estado: string | null
          id: string
          pais: string
          parceiro_id: string
          tipo_zona: string
        }
        Insert: {
          cep_final?: string | null
          cep_inicial?: string | null
          cidade?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          pais?: string
          parceiro_id: string
          tipo_zona: string
        }
        Update: {
          cep_final?: string | null
          cep_inicial?: string | null
          cidade?: string | null
          created_at?: string
          estado?: string | null
          id?: string
          pais?: string
          parceiro_id?: string
          tipo_zona?: string
        }
        Relationships: [
          {
            foreignKeyName: "parceiro_zonas_permitidas_parceiro_id_fkey"
            columns: ["parceiro_id"]
            isOneToOne: false
            referencedRelation: "parceiros"
            referencedColumns: ["id"]
          },
        ]
      }
      parceiros: {
        Row: {
          address: Json | null
          category_preferences: string[] | null
          charges_enabled: boolean | null
          comissao_pct: number
          company_name: string | null
          created_at: string | null
          custo_frete_proprio_cents: number | null
          gerenciamento_frete: string
          id: string
          nome: string
          onboarding_completed_at: string | null
          onboarding_step: number
          owner_id: string | null
          phone: string | null
          plano: string
          profile_complete: boolean
          rating: number | null
          slug: string | null
          stripe_account_id: string | null
          tax_id: string | null
          website_url: string | null
        }
        Insert: {
          address?: Json | null
          category_preferences?: string[] | null
          charges_enabled?: boolean | null
          comissao_pct?: number
          company_name?: string | null
          created_at?: string | null
          custo_frete_proprio_cents?: number | null
          gerenciamento_frete?: string
          id?: string
          nome: string
          onboarding_completed_at?: string | null
          onboarding_step?: number
          owner_id?: string | null
          phone?: string | null
          plano: string
          profile_complete?: boolean
          rating?: number | null
          slug?: string | null
          stripe_account_id?: string | null
          tax_id?: string | null
          website_url?: string | null
        }
        Update: {
          address?: Json | null
          category_preferences?: string[] | null
          charges_enabled?: boolean | null
          comissao_pct?: number
          company_name?: string | null
          created_at?: string | null
          custo_frete_proprio_cents?: number | null
          gerenciamento_frete?: string
          id?: string
          nome?: string
          onboarding_completed_at?: string | null
          onboarding_step?: number
          owner_id?: string | null
          phone?: string | null
          plano?: string
          profile_complete?: boolean
          rating?: number | null
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
      planos_produto: {
        Row: {
          ativo: boolean
          cobra_frete: boolean
          created_at: string
          currency: string
          descricao: string | null
          id: string
          intervalo: string
          intervalo_count: number
          nome: string
          preco_cents: number
          produto_id: string
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cobra_frete?: boolean
          created_at?: string
          currency?: string
          descricao?: string | null
          id?: string
          intervalo: string
          intervalo_count?: number
          nome: string
          preco_cents: number
          produto_id: string
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cobra_frete?: boolean
          created_at?: string
          currency?: string
          descricao?: string | null
          id?: string
          intervalo?: string
          intervalo_count?: number
          nome?: string
          preco_cents?: number
          produto_id?: string
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_produto_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      product_brands: {
        Row: {
          brand_id: number
          product_id: string
        }
        Insert: {
          brand_id: number
          product_id: string
        }
        Update: {
          brand_id?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_brands_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_brands_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: number
          product_id: string
        }
        Insert: {
          category_id: number
          product_id: string
        }
        Update: {
          category_id?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_atributo_valores: {
        Row: {
          atributo_id: string
          criado_em: string
          id: string
          valor: string
        }
        Insert: {
          atributo_id: string
          criado_em?: string
          id?: string
          valor: string
        }
        Update: {
          atributo_id?: string
          criado_em?: string
          id?: string
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_atributo_valores_atributo_id_fkey"
            columns: ["atributo_id"]
            isOneToOne: false
            referencedRelation: "produto_atributos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_atributos: {
        Row: {
          criado_em: string
          id: string
          nome: string
          produto_id: string
          unidade_medida: string | null
        }
        Insert: {
          criado_em?: string
          id?: string
          nome: string
          produto_id: string
          unidade_medida?: string | null
        }
        Update: {
          criado_em?: string
          id?: string
          nome?: string
          produto_id?: string
          unidade_medida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_atributos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_imagens: {
        Row: {
          created_at: string
          id: string
          imagem_url: string
          is_destaque: boolean
          ordem: number
          produto_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          imagem_url: string
          is_destaque?: boolean
          ordem?: number
          produto_id: string
        }
        Update: {
          created_at?: string
          id?: string
          imagem_url?: string
          is_destaque?: boolean
          ordem?: number
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_imagens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_variantes: {
        Row: {
          criado_em: string
          estoque: number
          id: string
          preco_cents: number
          produto_id: string
          sku: string | null
          stripe_price_id: string | null
        }
        Insert: {
          criado_em?: string
          estoque?: number
          id?: string
          preco_cents: number
          produto_id: string
          sku?: string | null
          stripe_price_id?: string | null
        }
        Update: {
          criado_em?: string
          estoque?: number
          id?: string
          preco_cents?: number
          produto_id?: string
          sku?: string | null
          stripe_price_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_variantes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          average_rating: number | null
          created_at: string | null
          currency: string | null
          descricao: string | null
          dimensoes_cm: Json | null
          id: string
          media_iframe: string | null
          parceiro_id: string | null
          peso_gramas: number | null
          preco_cents: number
          promo_code: string | null
          published_at: string | null
          rating: number
          rating_media: number | null
          reviewed: boolean | null
          sku: string | null
          slug: string | null
          status_estoque: Database["public"]["Enums"]["produtos_status_estoque_enum"]
          stock: number
          stock_quantity: number | null
          tags: string[] | null
          tipo_produto: string
          titulo: string
          total_reviews: number | null
          tsv: unknown | null
        }
        Insert: {
          ativo?: boolean | null
          average_rating?: number | null
          created_at?: string | null
          currency?: string | null
          descricao?: string | null
          dimensoes_cm?: Json | null
          id?: string
          media_iframe?: string | null
          parceiro_id?: string | null
          peso_gramas?: number | null
          preco_cents: number
          promo_code?: string | null
          published_at?: string | null
          rating?: number
          rating_media?: number | null
          reviewed?: boolean | null
          sku?: string | null
          slug?: string | null
          status_estoque?: Database["public"]["Enums"]["produtos_status_estoque_enum"]
          stock?: number
          stock_quantity?: number | null
          tags?: string[] | null
          tipo_produto?: string
          titulo: string
          total_reviews?: number | null
          tsv?: unknown | null
        }
        Update: {
          ativo?: boolean | null
          average_rating?: number | null
          created_at?: string | null
          currency?: string | null
          descricao?: string | null
          dimensoes_cm?: Json | null
          id?: string
          media_iframe?: string | null
          parceiro_id?: string | null
          peso_gramas?: number | null
          preco_cents?: number
          promo_code?: string | null
          published_at?: string | null
          rating?: number
          rating_media?: number | null
          reviewed?: boolean | null
          sku?: string | null
          slug?: string | null
          status_estoque?: Database["public"]["Enums"]["produtos_status_estoque_enum"]
          stock?: number
          stock_quantity?: number | null
          tags?: string[] | null
          tipo_produto?: string
          titulo?: string
          total_reviews?: number | null
          tsv?: unknown | null
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
          comissao_envio_subclue_cents: number | null
          comissao_subclue_cents: number | null
          created_at: string | null
          currency: string | null
          custo_envio_cents: number | null
          endereco_entrega_id: string | null
          id: number
          taxa_processador_cents: number | null
          valor_bruto: number | null
          valor_bruto_cents: number
          valor_liq: number | null
          valor_liquido_parceiro_cents: number | null
        }
        Insert: {
          application_fee?: number | null
          assinatura_id?: string | null
          comissao_envio_subclue_cents?: number | null
          comissao_subclue_cents?: number | null
          created_at?: string | null
          currency?: string | null
          custo_envio_cents?: number | null
          endereco_entrega_id?: string | null
          id?: number
          taxa_processador_cents?: number | null
          valor_bruto?: number | null
          valor_bruto_cents?: number
          valor_liq?: number | null
          valor_liquido_parceiro_cents?: number | null
        }
        Update: {
          application_fee?: number | null
          assinatura_id?: string | null
          comissao_envio_subclue_cents?: number | null
          comissao_subclue_cents?: number | null
          created_at?: string | null
          currency?: string | null
          custo_envio_cents?: number | null
          endereco_entrega_id?: string | null
          id?: number
          taxa_processador_cents?: number | null
          valor_bruto?: number | null
          valor_bruto_cents?: number
          valor_liq?: number | null
          valor_liquido_parceiro_cents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_assinatura_id_fkey"
            columns: ["assinatura_id"]
            isOneToOne: false
            referencedRelation: "assinantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_endereco_entrega_id_fkey"
            columns: ["endereco_entrega_id"]
            isOneToOne: false
            referencedRelation: "enderecos"
            referencedColumns: ["id"]
          },
        ]
      }
      variante_valores: {
        Row: {
          atributo_id: string
          atributo_valor_id: string
          id: string
          valor_id: string | null
          variante_id: string
        }
        Insert: {
          atributo_id: string
          atributo_valor_id: string
          id?: string
          valor_id?: string | null
          variante_id: string
        }
        Update: {
          atributo_id?: string
          atributo_valor_id?: string
          id?: string
          valor_id?: string | null
          variante_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variante_valores_atributo_id_fkey"
            columns: ["atributo_id"]
            isOneToOne: false
            referencedRelation: "produto_atributos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variante_valores_atributo_valor_id_fkey"
            columns: ["atributo_valor_id"]
            isOneToOne: false
            referencedRelation: "produto_atributo_valores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variante_valores_variante_id_fkey"
            columns: ["variante_id"]
            isOneToOne: false
            referencedRelation: "produto_variantes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_roles: {
        Row: {
          role: string | null
          user_id: string | null
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
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      minha_funcao_teste_simples: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      resolve_user_role: {
        Args: { p_uid: string }
        Returns: string
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      slugify: {
        Args: { src: string }
        Returns: string
      }
    }
    Enums: {
      assinantes_status_enum: "active" | "canceled" | "trial" | "past_due"
      produtos_status_estoque_enum: "in_stock" | "out_of_stock" | "preorder"
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
    Enums: {
      assinantes_status_enum: ["active", "canceled", "trial", "past_due"],
      produtos_status_estoque_enum: ["in_stock", "out_of_stock", "preorder"],
    },
  },
} as const

