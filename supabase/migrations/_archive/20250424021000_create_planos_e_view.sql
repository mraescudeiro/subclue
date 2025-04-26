-- Tabela de planos por parceiro
CREATE TABLE public.planos_parceiro (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parceiro_id uuid NOT NULL REFERENCES parceiros(id) ON DELETE CASCADE,
  data_inicio date NOT NULL DEFAULT current_date,
  data_fim    date NOT NULL,
  notificacao_renovacao_enviada boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'ATIVO',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para acelerar busca por vencimento
CREATE INDEX planos_parceiro_fim_idx
  ON public.planos_parceiro (data_fim, notificacao_renovacao_enviada);

-- View consumida pela Edge Function
CREATE OR REPLACE VIEW public.vw_planos_a_vencer AS
SELECT
  pp.id                    AS plano_id,
  COALESCE(u.email,'<SEM EMAIL>') AS email,
  pr.nome         AS nome_parceiro,
  pp.data_fim              AS data_vencimento,
  pp.notificacao_renovacao_enviada
FROM planos_parceiro pp
JOIN parceiros      pr ON pr.id = pp.parceiro_id
LEFT JOIN auth.users u ON u.id  = pr.owner_id
WHERE
  pp.data_fim BETWEEN current_date
                 AND current_date + INTERVAL '7 days'
  AND pp.notificacao_renovacao_enviada = false;
