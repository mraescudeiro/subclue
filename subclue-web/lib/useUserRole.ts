// lib/useUserRole.ts
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext'; // Importar useAuth

const isProd = process.env.NODE_ENV === 'production';
const SUPABASE_FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL || 'http://127.0.0.1:54321';
const FUNCTION_ENDPOINT = isProd
  ? `${SUPABASE_FUNCTIONS_URL}/functions/v1/resolve_user_role`
  : '/api/proxy-user-role'; // Seu proxy para a Edge Function em dev

export function useUserRole(userId?: string) {
  const { accessToken } = useAuth();
  const [role, setRole] = useState<'parceiro' | 'assinante' | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(`[useUserRole] Hook instance. userId: ${userId}, Got accessToken: ${!!accessToken}, Current loading: ${loading}, Current role: ${role}`);

  useEffect(() => {
    console.log(`[useUserRole] useEffect triggered. userId: ${userId}, accessToken available: ${!!accessToken}`);

    async function fetchUserRole() {
      if (!userId) {
        console.log('[useUserRole] No userId, setting role to null and loading to false.');
        setRole(null);
        setLoading(false);
        return;
      }

      if (!accessToken) {
        console.log('[useUserRole] No accessToken from AuthContext. Will wait for token if userId is present.');
        if (!loading) setLoading(true);
        return;
      }

      setLoading(true);
      console.log(`[useUserRole] Fetching role for userId: ${userId}. Endpoint: ${FUNCTION_ENDPOINT}`);

      try {
        const response = await fetch(FUNCTION_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ userId }),
        });

        const responseText = await response.text();
        console.log('[useUserRole] Raw API response:', responseText);

        if (!response.ok) {
          console.error(`[useUserRole] API error fetching role: ${response.status} ${response.statusText}`, responseText);
          setRole(null);
          setLoading(false);
          return;
        }

        const json = JSON.parse(responseText);
        console.log('[useUserRole] Parsed JSON API response:', json);

        if (json && (json.role === 'parceiro' || json.role === 'assinante' || json.role === null)) {
          setRole(json.role);
          console.log(`[useUserRole] Role set to: ${json.role}`);
        } else {
          console.warn('[useUserRole] "role" not found or invalid in API response:', json);
          setRole(null);
        }
      } catch (err: any) {
        setRole(null);
        console.error('[useUserRole] Unexpected error (catch) fetching user role:', err.message || err);
      } finally {
        setLoading(false);
        console.log('[useUserRole] Finished fetching role. Loading set to false.');
      }
    }

    fetchUserRole();
  }, [userId, accessToken]);

  return { role, loading };
}