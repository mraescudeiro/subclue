// lib/supabase/client.ts
'use client'; // Opcional, mas boa prática se só for usado por client components

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types'; // Certifique-se que este caminho está correto

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}