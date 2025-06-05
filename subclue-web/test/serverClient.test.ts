import { createSupabaseServerClient } from '../lib/supabase/server';

// Simple type check: ensure function returns Promise with supabase property
async function check() {
  const { supabase } = await createSupabaseServerClient();
  console.log(typeof supabase);
}

check();
