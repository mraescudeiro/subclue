// lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types' // Mantenha se você tiver este arquivo e desejar tipagem

// Certifique-se de que suas variáveis de ambiente estão acessíveis no cliente
// (prefixadas com NEXT_PUBLIC_ no seu arquivo .env.local)
// Exemplo:
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

export const supabase = createBrowserClient<Database>( // Usar <Database> se tiver tipos
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)