import { apiClient } from './client';
import type { LoginResponse, MessageResponse, User } from '@/entities/user/model/types';

/**
 * Serviço de autenticação — consome os endpoints REST definidos na especificação.
 * Todas as funções utilizam o apiClient configurado (shared/api/client.ts),
 * que já gerencia interceptors de token e tratamento de 401.
 */

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
  return response.data;
}

export async function forgotPassword(email: string): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>('/auth/forgot-password', { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>('/auth/reset-password', { token, newPassword });
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}
