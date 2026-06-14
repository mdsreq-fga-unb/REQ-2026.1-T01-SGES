/**
 * Mock API handlers using Axios interceptors.
 * 
 * Simula as respostas da API de autenticação enquanto o backend não está pronto.
 * Os mocks são ativados apenas em ambiente de desenvolvimento (import.meta.env.DEV).
 * 
 * Credenciais mockadas:
 *   - admin@sges.com      / Senha123!  → role: admin
 *   - volunteer@sges.com  / Senha123!  → role: volunteer
 *   - Após 5 tentativas falhas seguidas → 423 (conta bloqueada)
 */

import { apiClient } from '@/shared/api/client';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// --- Mock state ---
let failedAttempts = 0;
const BLOCK_AFTER = 5;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes
let blockedUntil: number | null = null;

// Simulated JWT token
const MOCK_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNHRVMgTW9jayIsImlhdCI6MTUxNjIzOTAyMn0.mock';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer';
  password: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Carlos Gestor',
    email: 'admin@sges.com',
    role: 'admin',
    password: 'Senha123!',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Maria Instrutora',
    email: 'volunteer@sges.com',
    role: 'volunteer',
    password: 'Senha123!',
  },
];

let mockNotifications = [
  {
    id: 'n1',
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Carlos Gestor
    title: 'Alerta de Limite de Faltas Próximo',
    message: 'O estudante João Silva atingiu 2 faltas no curso Alfabetização. O limite máximo é de 3 faltas.',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'n2',
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Carlos Gestor
    title: 'Estudante Evadido por Faltas',
    message: 'O estudante Lucas Medeiros atingiu o limite de 3 faltas no curso Alfabetização e foi marcado como evadido.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'n3',
    userId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', // Maria Instrutora
    title: 'Alerta de Limite de Faltas Próximo',
    message: 'O estudante João Silva atingiu 2 faltas no curso Alfabetização. O limite máximo é de 3 faltas.',
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
];

let mockStudents = [
  {
    id: 's1',
    codigo_matricula: 'MAT-000001',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    profissao: 'Carpinteiro',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date().toISOString(),
  },
  {
    id: 's2',
    codigo_matricula: 'MAT-000002',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    profissao: 'Professora',
    foto_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: new Date().toISOString(),
  },
];

let mockClasses = [
  {
    id: 'c1',
    name: 'Alfabetização - Turma A',
    semester: '2026.1',
    schedule: 'Sábado à noite',
  },
  {
    id: 'c2',
    name: 'Corte e Costura - Turma B',
    semester: '2026.1',
    schedule: 'Quarta à tarde',
  },
];

// Track the last successful login for /auth/me validation
let currentLoggedUser: MockUser | null = null;

// Simulated network delay
function delay(ms: number = 400): Promise<void> {
  const jitter = Math.random() * 400; // 0–400ms extra
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
}

// Create a mock axios error response
function createMockError(status: number, message: string, config: InternalAxiosRequestConfig) {
  const error = {
    response: {
      status,
      data: { message },
      headers: {},
      statusText: status === 401 ? 'Unauthorized' : status === 423 ? 'Locked' : 'Bad Request',
      config,
    },
    config,
    isAxiosError: true,
    name: 'AxiosError',
    message,
    toJSON: () => ({}),
  } as AxiosError;
  return error;
}

/**
 * Instala os interceptors de mock no apiClient.
 * O interceptor intercepta requisições ANTES de elas saírem pela rede,
 * retornando respostas simuladas.
 */
export function setupMockApi(): void {
  // Request interceptor that intercepts and returns mock responses
  apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const url = config.url || '';
      const method = (config.method || 'get').toLowerCase();

      // --- POST /auth/login ---
      if (url === '/auth/login' && method === 'post') {
        await delay();
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

        // Check if account is blocked
        if (blockedUntil && Date.now() < blockedUntil) {
          const remainingMin = Math.ceil((blockedUntil - Date.now()) / 60000);
          throw createMockError(423, `Conta bloqueada. Tente novamente em ${remainingMin} minutos.`, config);
        }

        // Reset block if expired
        if (blockedUntil && Date.now() >= blockedUntil) {
          blockedUntil = null;
          failedAttempts = 0;
        }

        const user = MOCK_USERS.find(
          (u) => u.email === body.email && u.password === body.password
        );

        if (!user) {
          failedAttempts++;
          if (failedAttempts >= BLOCK_AFTER) {
            blockedUntil = Date.now() + BLOCK_DURATION_MS;
            throw createMockError(423, 'Conta bloqueada. Tente novamente em 5 minutos.', config);
          }
          throw createMockError(401, 'Credenciais inválidas.', config);
        }

        // Success
        failedAttempts = 0;
        currentLoggedUser = user;

        // Return adapter response that skips the actual HTTP request
        config.adapter = async () => ({
          data: {
            accessToken: MOCK_JWT,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });

        return config;
      }

      // --- POST /auth/forgot-password ---
      if (url === '/auth/forgot-password' && method === 'post') {
        await delay();

        config.adapter = async () => ({
          data: { message: 'Se o e-mail existir, um link será enviado.' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });

        return config;
      }

      // --- POST /auth/reset-password ---
      if (url === '/auth/reset-password' && method === 'post') {
        await delay();
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

        if (!body.token || body.token === 'invalid-token' || body.token === 'expired-token') {
          throw createMockError(400, 'Token inválido ou expirado.', config);
        }

        config.adapter = async () => ({
          data: { message: 'Senha redefinida com sucesso.' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });

        return config;
      }

      // --- POST /auth/logout ---
      if (url === '/auth/logout' && method === 'post') {
        await delay(100);
        currentLoggedUser = null;

        config.adapter = async () => ({
          data: null,
          status: 204,
          statusText: 'No Content',
          headers: {},
          config,
        });

        return config;
      }

      // --- GET /auth/me ---
      if (url === '/auth/me' && method === 'get') {
        await delay(200);

        const authHeader = config.headers?.Authorization as string | undefined;
        if (!authHeader || !authHeader.startsWith('Bearer ') || !currentLoggedUser) {
          throw createMockError(401, 'Token inválido ou expirado.', config);
        }

        config.adapter = async () => ({
          data: {
            id: currentLoggedUser!.id,
            name: currentLoggedUser!.name,
            email: currentLoggedUser!.email,
            role: currentLoggedUser!.role,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });

        return config;
      }

      // --- GET /notifications ---
      if (url === '/notifications' && method === 'get') {
        await delay(100);
        const authHeader = config.headers?.Authorization as string | undefined;
        if (!authHeader || !authHeader.startsWith('Bearer ') || !currentLoggedUser) {
          throw createMockError(401, 'Token inválido ou expirado.', config);
        }

        const userNotifications = mockNotifications.filter((n) => n.userId === currentLoggedUser?.id);

        config.adapter = async () => ({
          data: userNotifications,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });

        return config;
      }

      // --- PUT /notifications/:id/read ---
      if (url.startsWith('/notifications/') && url.endsWith('/read') && method === 'put') {
        await delay(100);
        const parts = url.split('/');
        const id = parts[2];
        const notification = mockNotifications.find((n) => n.id === id);
        if (notification) {
          notification.isRead = true;
        }

        config.adapter = async () => ({
          data: { success: true },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });

        return config;
      }

      // --- GET /students ---
      if (url === '/students' && method === 'get') {
        await delay(100);
        config.adapter = async () => ({
          data: mockStudents,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /students ---
      if (url === '/students' && method === 'post') {
        await delay(200);
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newStudent = {
          id: `s${mockStudents.length + 1}`,
          codigo_matricula: `MAT-${String(mockStudents.length + 1).padStart(6, '0')}`,
          name: body.name,
          email: body.email,
          profissao: body.profissao,
          foto_url: body.foto_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          createdAt: new Date().toISOString(),
        };
        mockStudents.unshift(newStudent);

        config.adapter = async () => ({
          data: newStudent,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- PUT /students/:id ---
      if (url.startsWith('/students/') && method === 'put') {
        await delay(200);
        const parts = url.split('/');
        const id = parts[2];
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const studentIndex = mockStudents.findIndex((s) => s.id === id);
        if (studentIndex === -1) {
          throw createMockError(404, 'Estudante não encontrado.', config);
        }

        mockStudents[studentIndex] = {
          ...mockStudents[studentIndex],
          name: body.name,
          email: body.email,
          profissao: body.profissao,
          foto_url: body.foto_url || mockStudents[studentIndex].foto_url,
        };

        config.adapter = async () => ({
          data: mockStudents[studentIndex],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- GET /classes ---
      if (url === '/classes' && method === 'get') {
        await delay(100);
        config.adapter = async () => ({
          data: mockClasses,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- GET /classes/:classId/students ---
      if (url.startsWith('/classes/') && url.endsWith('/students') && method === 'get') {
        await delay(150);
        config.adapter = async () => ({
          data: mockStudents,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /classes/:classId/attendances ---
      if (url.startsWith('/classes/') && url.endsWith('/attendances') && method === 'post') {
        await delay(200);
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        console.log('[SGES Mock API] Presenças salvas:', body);

        config.adapter = async () => ({
          data: { success: true, count: body.length },
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- GET /reports/funnel ---
      if (url.startsWith('/reports/funnel') && method === 'get') {
        await delay(150);
        const params = new URLSearchParams(url.split('?')[1] || '');
        const semester = params.get('semester') || '2026.1';

        const data = semester === '2026.1'
          ? {
              entered: 120,
              active: 80,
              evaded: 15,
              completed: 25,
            }
          : {
              entered: 95,
              active: 0,
              evaded: 12,
              completed: 83,
            };

        config.adapter = async () => ({
          data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // All other requests pass through normally
      return config;
    },
    (error) => Promise.reject(error)
  );

  console.log(
    '%c[SGES Mock API] Mocks de autenticação ativados.',
    'color: #4ade80; font-weight: bold;'
  );
  console.log(
    '%c  Credenciais: admin@sges.com / Senha123!  |  volunteer@sges.com / Senha123!',
    'color: #94a3b8;'
  );
}
