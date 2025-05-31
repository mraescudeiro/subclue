// subclue-web/lib/supabaseClient.ts

// import { createClient } from '@supabase/supabase-js' // Comentado - não vamos criar um cliente global aqui
// import type { Database } from './database.types' // Tipos gerados pelo Supabase - pode ser útil manter se outros arquivos importarem daqui

// Obtenha as variáveis de ambiente
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// if (!supabaseUrl) {
//   throw new Error('A variável de ambiente NEXT_PUBLIC_SUPABASE_URL não está definida.')
// }
// if (!supabaseAnonKey) {
//   throw new Error('A variável de ambiente NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida.')
// }

// A criação do cliente foi movida/centralizada no AuthContext.tsx para o lado do cliente (usando createBrowserClient)
// e em Server Components/Actions (usando createServerClient).
// Este arquivo não deve mais exportar uma instância de cliente para evitar múltiplas instâncias.
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) // <<== COMENTADO E REMOVIDO

// Você pode usar este arquivo para reexportar tipos ou outras constantes/utilitários do Supabase, se desejar.
// Exemplo:
// export type { Database } from './database.types';

// Se este arquivo não tiver mais nenhum outro propósito, você poderá até mesmo deletá-lo no futuro,
// após garantir que nenhum outro arquivo esteja tentando importar 'supabase' dele.
// Por enquanto, deixar comentado é seguro.