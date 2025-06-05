import { createSupabaseServerClient } from '../lib/supabase/server';

// Mock cookie store used during tests so that createSupabaseServerClient does
// not rely on Next.js request context.
const mockStore = {
  get: (_name: string) => undefined,
} as any;

// Simple type check: ensure function returns Promise with supabase property
async function check() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

  const { supabase } = await createSupabaseServerClient(mockStore);
  console.log(typeof supabase);
}

check();
