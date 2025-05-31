// components/Header.tsx
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr'; // CookieOptions é usado
import HeaderClient from './HeaderClient';
import type { Database } from '@/lib/database.types';
import type { User } from '@supabase/supabase-js';

export default async function Header() {
  const cookieStore = cookies(); // Chamada no topo do Server Component

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) { // Especificando tipo de options
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.warn(`[Header_RSC_CookieSetWarn] Attempted to set cookie '${name}' or failed:`, error);
          }
        },
        remove(name: string, options: CookieOptions) { // Especificando tipo de options
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          } catch (error) {
            console.warn(`[Header_RSC_CookieRemoveWarn] Attempted to remove cookie '${name}' or failed:`, error);
          }
        },
      },
    }
  );

  let user: User | null = null;
  let sessionError: string | null = null;

  try {
    const { data, error: getUserError } = await supabase.auth.getUser();

    if (getUserError) {
      if (getUserError.name === "AuthSessionMissingError") {
        console.log('[Header RSC] No user session on server (AuthSessionMissingError). Line 51 approx.');
      } else {
        console.error('[Header RSC] Error from supabase.auth.getUser():', getUserError.message);
        sessionError = getUserError.message;
      }
    }
    
    if (data && data.user) {
      user = data.user;
      console.log('[Header RSC] User session on server (in Header.tsx):', user.id, 'Line 62 approx.');
    } else if (!getUserError) {
      console.log('[Header RSC] No user session on server (data.user is null, no previous error).');
    }
  } catch (e: any) { 
    console.error('[Header RSC] Generic error fetching user session (in Header.tsx):', e.message, 'Line 75 approx.');
    sessionError = e.message;
  }

  return <HeaderClient initialUser={user} initialServerSessionError={sessionError} />;
}