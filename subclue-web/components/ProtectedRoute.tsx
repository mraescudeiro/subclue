// components/ProtectedRoute.tsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingScreen from './LoadingScreen'; // Certifique-se que este caminho está correto e o arquivo existe

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Tornando opcional com um fallback, mas idealmente deve ser sempre passado
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => { // Default para array vazio
  const { user, isLoadingSession, userRole, isLoadingRole, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[ProtectedRoute] useEffect Check:', {
      isLoading: isLoadingSession,
      isLoadingRole,
      user: !!user,
      userId: user?.id,
      userRole,
      authError,
      passedAllowedRoles: allowedRoles, // Log para ver o que está sendo passado
      pathname: typeof window !== 'undefined' ? window.location.pathname : ''
    });

    if (!isLoadingSession && !isLoadingRole) {
      if (!user || authError) {
        console.log('[ProtectedRoute] No user or serverSessionError. Redirecting to /login.');
        router.replace('/login');
      } else if (allowedRoles && allowedRoles.length > 0) { // Só checar papéis se allowedRoles for fornecido e não vazio
        if (!userRole) {
          console.warn('[ProtectedRoute] User authenticated, but userRole is null and route expects roles. Redirecting to /.');
          router.replace('/'); // Ou uma página de "acesso negado" ou "perfil incompleto"
        } else if (!allowedRoles.includes(userRole)) { // ERRO ESTAVA AQUI SE allowedRoles FOSSE UNDEFINED
          console.log(`[ProtectedRoute] User role '${userRole}' not in allowedRoles ${JSON.stringify(allowedRoles)}. Redirecting to /.`);
          router.replace('/');
        }
      }
      // Se allowedRoles for um array vazio ou não fornecido, e o usuário estiver logado, permite o acesso.
      // (Pode ajustar essa lógica se rotas protegidas sempre exigirem pelo menos um papel).
    }
  }, [user, isLoadingSession, userRole, isLoadingRole, allowedRoles, router, authError]);

  if (isLoadingSession || isLoadingRole) {
    console.log('[ProtectedRoute] Showing LoadingScreen:', { isLoading: isLoadingSession, isLoadingRole });
    return <LoadingScreen />;
  }

  // Condição final para renderizar ou não
  if (!user || authError) {
    console.log('[ProtectedRoute] Final check: No user or serverSessionError. Not rendering children.');
    return <LoadingScreen />;
  }

  // Se a rota exige papéis específicos
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log(`[ProtectedRoute] Final check: Role '${userRole}' not suitable for allowed roles ${JSON.stringify(allowedRoles)}. Not rendering children.`);
      return <LoadingScreen />; // Previne flash, useEffect deve redirecionar
    }
  }

  console.log('[ProtectedRoute] User authenticated and authorized (or route allows any authenticated user). Rendering children.');
  return <>{children}</>;
};

export default ProtectedRoute;
