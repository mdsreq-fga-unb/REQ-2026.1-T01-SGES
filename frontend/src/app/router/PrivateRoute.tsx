import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { Spinner } from '@/shared/components/Spinner';

/**
 * Componente de rota protegida.
 * - loading → exibe spinner de tela cheia
 * - !isAuthenticated → redireciona para /login
 * - caso contrário → renderiza <Outlet /> (rota filha)
 */
export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner fullScreen label="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
