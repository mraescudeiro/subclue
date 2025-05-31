// app/actions/auth.ts
'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr'; // CookieOptions é usado
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

function getSupabaseServerClientActions() {
    const cookieStore = cookies(); 

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value; // Linha 20 approx.
                },
                set(name: string, value: string, options: CookieOptions) { // Especificando tipo
                    try {
                        cookieStore.set({ name, value, ...options }); // Linha 24 approx.
                    } catch (error) {
                        console.error(`[SA_COOKIE_SET_ERROR] Server Action: Failed to set cookie ${name}`, error);
                    }
                },
                remove(name: string, options: CookieOptions) { // Especificando tipo
                    try {
                        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
                    } catch (error) {
                        console.error(`[SA_COOKIE_REMOVE_ERROR] Server Action: Failed to remove cookie ${name}`, error);
                    }
                },
            },
        }
    );
}

export async function setServerSession(accessToken: string, refreshToken: string) {
  const supabase = getSupabaseServerClientActions();

  console.log('[SA_setServerSession] Attempting to set server session...'); // Linha 41 approx.
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    console.error('[SA_setServerSession] Error setting server session:', error.message);
    return { success: false, error: error.message, user: null, session: null };
  }
  if (!data.session || !data.user) {
    console.error('[SA_setServerSession] No session or user data returned from setSession. Tokens might be invalid.');
    try {
        const cookieStore = cookies(); 
        const allCookies = cookieStore.getAll();
        for (const cookie of allCookies) {
            if (cookie.name.startsWith('sb-')) {
                cookieStore.set({ name: cookie.name, value: '', maxAge: 0, path: '/' });
            }
        }
    } catch (e) {
        console.error('[SA_setServerSession] Failed to clear Supabase cookies after failed setSession:', e);
    }
    return { success: false, error: 'No session or user data after setSession.', user: null, session: null };
  }

  console.log('[SA_setServerSession] Server session set successfully. User ID:', data.user?.id);
  return { success: true, user: data.user, session: data.session, error: null };
}

export async function signOutServerAction() {
  const supabase = getSupabaseServerClientActions();

  console.log('[SA_signOutServerAction] Attempting server-side signOut...');
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('[SA_signOutServerAction] Error during server-side signOut:', error.message);
    return { success: false, error: error.message };
  }

  console.log('[SA_signOutServerAction] Server-side signOut successful.');
  return { success: true, error: null };
}