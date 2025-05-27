// subclue-web/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types' // Tipos gerados pelo Supabase

// Obtenha as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('A variável de ambiente NEXT_PUBLIC_SUPABASE_URL não está definida.')
}
if (!supabaseAnonKey) {
  throw new Error('A variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida.')
}

// Cria e exporta o Supabase client tipado (apenas UMA instância para todo o app)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
