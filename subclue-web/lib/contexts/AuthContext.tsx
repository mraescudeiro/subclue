// lib/contexts/AuthContext.tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js' // Importar Session
import { supabase } from '@/lib/supabaseClient' // Sua instância do cliente Supabase para o frontend

interface AuthCtx {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  loggingOut: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({
  serverUser,
  children,
}: {
  serverUser: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(serverUser);
  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  console.log('[AUTH_PROVIDER] Initializing. Server user ID:', serverUser?.id);

  useEffect(() => {
    console.log('[AUTH_PROVIDER] useEffect for getSession & onAuthStateChange.');

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('[AUTH_PROVIDER] getSession() on mount. User in session:', initialSession?.user?.id);
      if (initialSession) {
        setUser(initialSession.user);
        setSession(initialSession);
        setAccessToken(initialSession.access_token);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`[AUTH_PROVIDER] onAuthStateChange event: ${event}. User in session: ${currentSession?.user?.id}`);
      setUser(currentSession?.user ?? null);
      setSession(currentSession ?? null);
      setAccessToken(currentSession?.access_token ?? null);

      if (event === 'SIGNED_OUT') {
          console.log('[AUTH_PROVIDER] SIGNED_OUT: User, session, token cleared.');
      }
      if (event === 'SIGNED_IN') {
        console.log('[AUTH_PROVIDER] SIGNED_IN: User, session, token set.');
      }
    });

    return () => {
      console.log('[AUTH_PROVIDER] Unsubscribing from onAuthStateChange.');
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log(`[AUTH_PROVIDER] State update: User ID: ${user?.id}, AccessToken Present: ${!!accessToken}`);
  }, [user, accessToken]);

  const handleFrontendLogout = async () => {
    console.log('[AUTH_PROVIDER] handleFrontendLogout called. Clearing client state.');
    setUser(null);
    setSession(null);
    setAccessToken(null);
    setLoggingOut(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, accessToken, loggingOut, logout: handleFrontendLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
