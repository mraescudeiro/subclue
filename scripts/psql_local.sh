-- Policy RLS para brands
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'brands'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_policies
       WHERE schemaname = 'public' AND tablename = 'brands' AND policyname = 'brands_select_all'
    ) THEN
      CREATE POLICY brands_select_all
        ON public.brands FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;

-- Policy RLS para product_brands
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'product_brands'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_policies
       WHERE schemaname = 'public' AND tablename = 'product_brands' AND policyname = 'product_brands_select_all'
    ) THEN
      CREATE POLICY product_brands_select_all
        ON public.product_brands FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;

-- Policies RLS para shipping_commissions (acesso só do dono)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'shipping_commissions'
  ) THEN
    -- SELECT: Apenas dono do parceiro pode ver suas configs
    IF NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_policies
       WHERE schemaname = 'public' AND tablename = 'shipping_commissions' AND policyname = 'shipping_comm_select_owner'
    ) THEN
      CREATE POLICY shipping_comm_select_owner
        ON public.shipping_commissions FOR SELECT
        USING (
          parceiro_id IN (SELECT parceiros.id FROM parceiros WHERE parceiros.owner_id = auth.uid())
        );
    END IF;

    -- INSERT: Só dono pode inserir sua config
    IF NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_policies
       WHERE schemaname = 'public' AND tablename = 'shipping_commissions' AND policyname = 'shipping_comm_insert_owner'
    ) THEN
      CREATE POLICY shipping_comm_insert_owner
        ON public.shipping_commissions FOR INSERT
        WITH CHECK (
          parceiro_id IN (SELECT parceiros.id FROM parceiros WHERE parceiros.owner_id = auth.uid())
        );
    END IF;

    -- UPDATE: Só dono pode atualizar sua config
    IF NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_policies
       WHERE schemaname = 'public' AND tablename = 'shipping_commissions' AND policyname = 'shipping_comm_update_owner'
    ) THEN
      CREATE POLICY shipping_comm_update_owner
        ON public.shipping_commissions FOR UPDATE
        USING (
          parceiro_id IN (SELECT parceiros.id FROM parceiros WHERE parceiros.owner_id = auth.uid())
        );
    END IF;

    -- DELETE: Só dono pode deletar sua config
    IF NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_policies
       WHERE schemaname = 'public' AND tablename = 'shipping_commissions' AND policyname = 'shipping_comm_delete_owner'
    ) THEN
      CREATE POLICY shipping_comm_delete_owner
        ON public.shipping_commissions FOR DELETE
        USING (
          parceiro_id IN (SELECT parceiros.id FROM parceiros WHERE parceiros.owner_id = auth.uid())
        );
    END IF;
  END IF;
END
$$;
