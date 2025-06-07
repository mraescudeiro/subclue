// lib/contexts/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/createBrowserSupabase';
import type {
  User,
  Session,
  AuthChangeEvent,
  SupabaseClient,
} from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

interface AuthContextType {
  supabase: SupabaseClient<Database>;
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  isLoadingSession: boolean;
  userRole: string | null;
  isLoadingRole: boolean;
  authError: { message: string } | null;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabase());

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [authError, setAuthError] = useState<{ message: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState<boolean>(false);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    clearAuthError();
    setIsLoadingSession(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthError({ message: error.message });
    } else {
      setUser(data.user ?? null);
      setSession(data.session ?? null);
      setAccessToken(data.session?.access_token ?? null);
      router.push('/');
    }

    setIsLoadingSession(false);
  }, [supabase, router, clearAuthError]);

  const signOut = useCallback(async () => {
    clearAuthError();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthError({ message: error.message });
    } else {
      setUser(null);
      setSession(null);
      setAccessToken(null);
      try {
        await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (e) {
        console.error('Failed to sign out on server', e);
      }
      router.push('/login');
    }
  }, [supabase, router, clearAuthError]);

  const getAccessToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }, [supabase]);

  const fetchUserRole = useCallback(async (userId: string | undefined) => {
    if (!userId) return;

    setIsLoadingRole(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch('/api/proxy-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setUserRole(data.role || null);
    } catch (e: any) {
      setAuthError({ message: e.message });
    } finally {
      setIsLoadingRole(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        setUser(session?.user ?? null);
        setSession(session);
        setAccessToken(session?.access_token ?? null);

        try {
          await fetch('/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ event, session }),
          });
        } catch (e) {
          console.error('Failed to refresh auth state', e);
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          router.refresh(); // força update nas Server Components
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, router]);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data }) => {
        setUser(data.session?.user ?? null);
        setSession(data.session ?? null);
        setAccessToken(data.session?.access_token ?? null);
      })
      .catch((e) => setAuthError({ message: e.message }))
      .finally(() => setIsLoadingSession(false));
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      fetchUserRole(user.id);
    }
  }, [user?.id, fetchUserRole]);

  const contextValue = useMemo(() => ({
    supabase,
    user,
    session,
    accessToken,
    isLoadingSession,
    userRole,
    isLoadingRole,
    authError,
    signInWithPassword,
    signOut,
    clearAuthError,
  }), [
    supabase,
    user,
    session,
    accessToken,
    isLoadingSession,
    userRole,
    isLoadingRole,
    authError,
    signInWithPassword,
    signOut,
    clearAuthError,
  ]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
