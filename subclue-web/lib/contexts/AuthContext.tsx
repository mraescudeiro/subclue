// lib/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { User, Session, AuthChangeEvent, SupabaseClient, AuthError } from '@supabase/supabase-js';
import { setServerSession, signOutServerAction } from '@/app/actions/auth';
import type { Database } from '@/lib/database.types';

// Tipos
interface UserRoleState {
  role: string | null;
  isLoadingRole: boolean;
  errorRole: string | null;
}

interface AuthContextType {
  supabase: SupabaseClient<Database>;
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  isLoading: boolean;
  userRole: string | null;
  isLoadingRole: boolean;
  serverSessionError: string | null;
  signInWithPasswordFlow: (email?: string, password?: string) => Promise<void>;
  signOutFlow: () => Promise<void>;
  setServerSessionError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  serverSession?: { user: User; session: Session; error: string | null } | null;
}

// Hook interno para buscar o papel do usuário
function useUserRole(
  userId: string | undefined,
  getAccessToken: () => Promise<string | null>
): UserRoleState {
  const [role, setRole] = useState<string | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState<boolean>(false);
  const [errorRole, setErrorRole] = useState<string | null>(null);

  const fetchRole = useCallback(async () => {
    if (!userId) {
      setRole(null);
      setIsLoadingRole(false);
      setErrorRole(null);
      return;
    }

    setIsLoadingRole(true);
    setErrorRole(null);
    console.log(`[useUserRole] Fetching role for userId: ${userId}.`);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Access token not available for fetching role.");
      }
      const response = await fetch('/api/proxy-user-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
        throw new Error(errorData.message || `Failed to fetch role: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('[useUserRole] Raw API response:', data);
      setRole(data.role || null);
    } catch (e: any) {
      console.error('[useUserRole] Error fetching role:', e.message);
      setErrorRole(e.message);
      setRole(null);
    } finally {
      setIsLoadingRole(false);
      console.log('[useUserRole] Finished fetching role. Loading set to false.');
    }
  }, [userId, getAccessToken]);

  useEffect(() => {
    // console.log(`[useUserRole] useEffect triggered. userId: ${userId}`);
    if (userId) {
      fetchRole();
    } else {
      setRole(null);
      setIsLoadingRole(false);
    }
  }, [userId, fetchRole]);

  return { role, isLoadingRole, errorRole };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  serverSession: initialServerSessionData
}) => {
  const router = useRouter();

  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [user, setUser] = useState<User | null>(initialServerSessionData?.user ?? null);
  const [session, setSession] = useState<Session | null>(initialServerSessionData?.session ?? null);
  const [accessToken, setAccessToken] = useState<string | null>(initialServerSessionData?.session?.access_token ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialServerSessionData);
  const [serverSessionError, setServerSessionErrorState] = useState<string | null>(initialServerSessionData?.error ?? null);

  const getAccessTokenCallback = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }, [supabase]);

  const { role: userRole, isLoadingRole, errorRole: userRoleError } = useUserRole(user?.id, getAccessTokenCallback);

  const setCombinedServerSessionError = (error: string | null) => {
    setServerSessionErrorState(error);
  };

  const handleAuthStateChange = useCallback(
    async (event: AuthChangeEvent, newSession: Session | null) => {
      console.log(`[AUTH_PROVIDER] onAuthStateChange event: ${event}, User: ${newSession?.user?.id}, AccessToken Present: ${!!newSession?.access_token}`);
      setIsLoading(true);
      setServerSessionErrorState(null);

      setUser(newSession?.user ?? null);
      setSession(newSession);
      setAccessToken(newSession?.access_token ?? null);

      if (event === 'SIGNED_IN') {
        if (newSession && newSession.user && newSession.access_token && newSession.refresh_token) {
          console.log('[AUTH_PROVIDER] SIGNED_IN: Attempting to set server session via Server Action...');
          try {
            const { success, error: serverActionError, user: serverUser } = await setServerSession(
              newSession.access_token,
              newSession.refresh_token
            );
            if (success && serverUser) {
              console.log('[AUTH_PROVIDER] Server session set successfully. User from server action:', serverUser.id);
              if (typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.pathname === '/cadastro')) {
                router.push('/');
              }
            } else {
              console.error('[AUTH_PROVIDER] Failed to set server session via Server Action:', serverActionError);
              setServerSessionErrorState(serverActionError || 'Failed to sync session with server.');
            }
          } catch (e: any) {
            console.error('[AUTH_PROVIDER] Exception calling setServerSession Server Action:', e.message);
            setServerSessionErrorState(e.message || 'Exception during server session sync.');
          }
        } else {
         console.warn('[AUTH_PROVIDER] SIGNED_IN event but session or tokens are missing.');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[AUTH_PROVIDER] SIGNED_OUT: Calling signOutServerAction...');
        try {
          await signOutServerAction();
          console.log('[AUTH_PROVIDER] signOutServerAction successful.');
        } catch (e: any) {
          console.error('[AUTH_PROVIDER] Error calling signOutServerAction:', e.message);
        }
        // MODIFICAÇÃO AQUI: Redirecionar para a home '/'
        if (router) {
            console.log('[AUTH_PROVIDER] User signed out. Redirecting to HOME (/).');
            router.push('/');
        }
      } else if (event === 'TOKEN_REFRESHED') {
         console.log('[AUTH_PROVIDER] TOKEN_REFRESHED: Attempting to update server session with new tokens.');
         if (newSession && newSession.access_token && newSession.refresh_token) {
             try {
                 await setServerSession(newSession.access_token, newSession.refresh_token);
                 console.log('[AUTH_PROVIDER] Server session updated after token refresh.');
             } catch (e:any) {
                 console.error('[AUTH_PROVIDER] Failed to update server session after token refresh:', e.message);
             }
         }
      }

      if (event !== 'USER_UPDATED' && !isLoadingRole) {
          setIsLoading(false);
      } else if (event === 'SIGNED_OUT') { 
          setIsLoading(false);
      }
    },
    [supabase, router, isLoadingRole]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      if (!initialServerSessionData) {
        console.log('[AUTH_PROVIDER] No initial server session. Attempting initial client getSession()...');
        setIsLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AUTH_PROVIDER] Error in initial getSession():", error.message);
          setServerSessionErrorState(error.message);
        }
        
        setUser(currentSession?.user ?? null);
        setSession(currentSession);
        setAccessToken(currentSession?.access_token ?? null);
        console.log('[AUTH_PROVIDER] Initial client getSession() completed. User in session:', currentSession?.user?.id);
        setIsLoading(false); 
      } else {
        console.log('[AUTH_PROVIDER] Initial session data provided by server. User ID:', initialServerSessionData.user?.id);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    console.log('[AUTH_PROVIDER] Subscribing to onAuthStateChange.');

    return () => {
      console.log('[AUTH_PROVIDER] Unsubscribing from onAuthStateChange.');
      subscription?.unsubscribe();
    };
  }, [supabase, handleAuthStateChange, initialServerSessionData]);

  useEffect(() => {
    if (!isLoadingRole && isLoading && (user !== null || session !== null || initialServerSessionData !== undefined)) {
        console.log('[AUTH_PROVIDER] Role loading finished, or user/session became non-null. Setting main isLoading to false.');
        setIsLoading(false);
    } else if (!isLoadingRole && isLoading && !user && !session && initialServerSessionData === null) {
      console.log('[AUTH_PROVIDER] Role loading finished, no user/session found. Setting main isLoading to false.');
      setIsLoading(false);
    }
  }, [isLoadingRole, isLoading, user, session, initialServerSessionData]);


  const signInWithPasswordFlow = useCallback(async (email?: string, password?: string) => {
    if (!email || !password) {
      console.error("[AUTH_PROVIDER] Email or password missing for signIn.");
      setServerSessionErrorState("Email e senha são obrigatórios.");
      return;
    }
    setIsLoading(true);
    setServerSessionErrorState(null);
    console.log(`[AUTH_PROVIDER] signInWithPasswordFlow: Attempting client-side signInWithPassword...`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('[AUTH_PROVIDER] signInWithPasswordFlow: Client-side signInWithPassword error:', error.message, error);
        setServerSessionErrorState(error.message || 'Credenciais inválidas');
        setIsLoading(false);
        return;
      }
      console.log('[AUTH_PROVIDER] signInWithPasswordFlow: Client-side signInWithPassword successful. User:', data.user?.id);
    } catch (e: any) {
      console.error('[AUTH_PROVIDER] signInWithPasswordFlow: Exception:', e.message);
      setServerSessionErrorState(e.message || 'Ocorreu um erro inesperado.');
      setIsLoading(false);
    }
  }, [supabase]);

  const signOutFlow = useCallback(async () => {
    setIsLoading(true);
    setServerSessionErrorState(null);
    console.log('[AUTH_PROVIDER] signOutFlow: Attempting client-side signOut...');
    const { error } = await supabase.auth.signOut(); 
    if (error) {
      console.error('[AUTH_PROVIDER] signOutFlow: Error during client-side signOut:', error.message);
      setServerSessionErrorState(error.message);
      setIsLoading(false); 
    }
  }, [supabase]);

  const contextValue = useMemo(() => ({
    supabase,
    user,
    session,
    accessToken,
    isLoading: isLoading || isLoadingRole,
    userRole,
    isLoadingRole,
    serverSessionError: serverSessionError || userRoleError,
    signInWithPasswordFlow,
    signOutFlow,
    setServerSessionError: setCombinedServerSessionError,
  }), [
    supabase, user, session, accessToken, isLoading, userRole, isLoadingRole,
    serverSessionError, userRoleError, signInWithPasswordFlow, signOutFlow
  ]);
  
  // console.log('[AUTH_PROVIDER] Context state snapshot:', { /* ... */ });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};