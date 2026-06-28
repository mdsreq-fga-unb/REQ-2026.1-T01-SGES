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
    name: 'Nayla Nobre',
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
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Nayla Nobre
    title: 'Alerta de Limite de Faltas Próximo',
    message: 'O estudante João Silva atingiu 2 faltas no curso Alfabetização. O limite máximo é de 3 faltas.',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'n2',
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Nayla Nobre
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
    nomeCurso: 'Alfabetização - Turma A',
    livrosEstudados: 'Apostila de Alfabetização Vol 1',
    horario: '19:00 - 21:00',
    diaSemana: 'Sábado',
    vagasLimite: 50,
    semester: '2026.1',
    instructors: [
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        name: 'Maria Instrutora',
        email: 'volunteer@sges.com',
        role: 'volunteer',
      }
    ],
  },
  {
    id: 'c2',
    nomeCurso: 'Corte e Costura - Turma B',
    livrosEstudados: 'Manual do Costureiro Iniciante',
    horario: '14:00 - 16:30',
    diaSemana: 'Quarta-feira',
    vagasLimite: 30,
    semester: '2026.1',
    instructors: [
      {
        id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        name: 'Maria Instrutora',
        email: 'volunteer@sges.com',
        role: 'volunteer',
      }
    ],
  },
];

let mockEnrollments: Record<string, string[]> = {
  'c1': ['s1', 's2'],
  'c2': ['s2'],
};

interface MockAttendance {
  classId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED' | 'FT';
  observacao: string | null;
  justificativaDetalhes: string | null;
}

let mockAttendances: MockAttendance[] = [];


let mockForms = [
  {
    id: 'f1',
    title: 'Pesquisa de Perfil Socioeconômico',
    description: 'Coleta de dados sobre renda e moradia dos beneficiários da SEAS.',
    fields: [
      { id: 'q1', type: 'text', label: 'Possui acesso a computador com internet em casa?', required: true },
      { id: 'q2', type: 'select', label: 'Renda Familiar aproximada', options: ['Até 1 salário mínimo', '1 a 2 salários mínimos', 'Mais de 2 salários mínimos'], required: true },
    ],
    createdAt: new Date().toISOString(),
  },
];

let mockFormResponses = [
  {
    id: 'r1',
    formId: 'f1',
    studentId: 's1',
    studentName: 'João Silva',
    answers: {
      q1: 'Sim, computador compartilhado com a família.',
      q2: 'Até 1 salário mínimo',
    },
    createdAt: new Date().toISOString(),
  },
];

let mockHistoryClasses = [
  {
    id: 'hc1',
    name: 'Alfabetização Inicial',
    semester: '2025.2',
    teacherName: 'Maria Silva',
    enrolledCount: 45,
    evadedCount: 4,
    completedCount: 41,
  },
  {
    id: 'hc2',
    name: 'Corte e Costura Básico',
    semester: '2025.2',
    teacherName: 'Roberto Santos',
    enrolledCount: 30,
    evadedCount: 3,
    completedCount: 27,
  },
  {
    id: 'hc3',
    name: 'Informática para Adultos',
    semester: '2025.1',
    teacherName: 'Lucas Lima',
    enrolledCount: 48,
    evadedCount: 6,
    completedCount: 42,
  },
];

let mockHistoryInstructors = [
  {
    id: 'hi1',
    teacherName: 'Maria Silva',
    className: 'Alfabetização Inicial',
    semester: '2025.2',
    hoursCount: 60,
  },
  {
    id: 'hi2',
    teacherName: 'Roberto Santos',
    className: 'Corte e Costura Básico',
    semester: '2025.2',
    hoursCount: 45,
  },
  {
    id: 'hi3',
    teacherName: 'Lucas Lima',
    className: 'Informática para Adultos',
    semester: '2025.1',
    hoursCount: 60,
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

// Helper para obter o token de autenticação de forma resiliente
function getAuthToken(config: InternalAxiosRequestConfig): string | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const localToken = window.localStorage.getItem('sges_token');
    if (localToken) return localToken;
  }
  const authHeader = config.headers?.Authorization as string | undefined;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
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

      // Restaurar sessão do mock do localStorage ou padrão se houver token Bearer
      const token = getAuthToken(config);
      if (!currentLoggedUser && token) {
        const savedUserId = typeof window !== 'undefined' ? window.localStorage.getItem('sges_mock_user_id') : null;
        if (savedUserId) {
          currentLoggedUser = MOCK_USERS.find((u) => u.id === savedUserId) || null;
        }
        if (!currentLoggedUser) {
          currentLoggedUser = MOCK_USERS[0]; // Padrão: Admin
        }
      }

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
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('sges_mock_user_id', user.id);
        }

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
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('sges_mock_user_id');
        }

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

        const token = getAuthToken(config);
        if (!token || !currentLoggedUser) {
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
        const token = getAuthToken(config);
        if (!token || !currentLoggedUser) {
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

      // --- GET /users ---
      if (url.startsWith('/users') && method === 'get' && !url.includes('/users/')) {
        await delay(100);
        config.adapter = async () => ({
          data: {
            users: MOCK_USERS.map((u) => ({
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
            })),
            total: MOCK_USERS.length,
            totalPages: 1,
            page: 1,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /users (Criar Usuário/Instrutor) ---
      if (url === '/users' && method === 'post') {
        await delay(200);
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

        if (MOCK_USERS.some(u => u.email.toLowerCase() === body.email.toLowerCase())) {
          throw createMockError(400, 'Já existe um usuário cadastrado com este e-mail.', config);
        }

        const newUser = {
          id: `u${MOCK_USERS.length + 1}`,
          name: body.name,
          email: body.email,
          role: body.role || 'volunteer',
          password: 'Senha123!',
        };

        MOCK_USERS.push(newUser);

        config.adapter = async () => ({
          data: newUser,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- DELETE /users/:id (Excluir Usuário/Instrutor) ---
      if (url.startsWith('/users/') && method === 'delete') {
        await delay(150);
        const parts = url.split('/');
        const userId = parts[2];

        if (userId === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890') {
          throw createMockError(400, 'Não é possível excluir o administrador principal.', config);
        }

        const index = MOCK_USERS.findIndex((u) => u.id === userId);
        if (index !== -1) {
          MOCK_USERS.splice(index, 1);
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

      // --- GET /classes ---
      if (url === '/classes' && method === 'get') {
        await delay(100);
        const classesWithCount = mockClasses.map((c) => ({
          ...c,
          studentsCount: (mockEnrollments[c.id] || []).length,
        }));
        config.adapter = async () => ({
          data: classesWithCount,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /classes (Criar Turma) ---
      if (url === '/classes' && method === 'post') {
        await delay(200);
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

        const instructorIds = body.instructorIds || [];
        if (instructorIds.length > 2) {
          throw createMockError(400, 'Uma turma pode ter no máximo 2 instrutores.', config);
        }

        const newId = `c${mockClasses.length + 1}`;
        const newClass = {
          id: newId,
          nomeCurso: body.nomeCurso,
          livrosEstudados: body.livrosEstudados || '',
          horario: body.horario,
          diaSemana: body.diaSemana,
          vagasLimite: body.vagasLimite ? Number(body.vagasLimite) : 50,
          instructors: MOCK_USERS.filter(u => instructorIds.includes(u.id)).map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role
          })),
          semester: '2026.1',
        };

        mockClasses.push(newClass);
        mockEnrollments[newId] = [];

        config.adapter = async () => ({
          data: newClass,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- PUT /classes/:classId (Editar/Atualizar Turma) ---
      if (url.startsWith('/classes/') && url.split('/').length === 3 && method === 'put') {
        await delay(200);
        const parts = url.split('/');
        const classId = parts[2];
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

        const instructorIds = body.instructorIds || [];
        if (instructorIds.length > 2) {
          throw createMockError(400, 'Uma turma pode ter no máximo 2 instrutores.', config);
        }

        const classIndex = mockClasses.findIndex(c => c.id === classId);
        if (classIndex === -1) {
          throw createMockError(404, 'Turma não encontrada.', config);
        }

        const updatedClass = {
          ...mockClasses[classIndex],
          nomeCurso: body.nomeCurso,
          livrosEstudados: body.livrosEstudados || '',
          horario: body.horario,
          diaSemana: body.diaSemana,
          vagasLimite: body.vagasLimite ? Number(body.vagasLimite) : 50,
          instructors: MOCK_USERS.filter(u => instructorIds.includes(u.id)).map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role
          })),
        };

        mockClasses[classIndex] = updatedClass;

        config.adapter = async () => ({
          data: updatedClass,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- DELETE /classes/:classId (Excluir Turma) ---
      if (url.startsWith('/classes/') && url.split('/').length === 3 && method === 'delete') {
        await delay(150);
        const parts = url.split('/');
        const classId = parts[2];

        mockClasses = mockClasses.filter((c) => c.id !== classId);
        delete mockEnrollments[classId];

        config.adapter = async () => ({
          data: { success: true },
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
        const parts = url.split('/');
        const classId = parts[2];
        const studentIds = mockEnrollments[classId] || [];
        const enrolledStudents = mockStudents.filter((s) => studentIds.includes(s.id));
        config.adapter = async () => ({
          data: enrolledStudents,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /classes/:classId/students (Matricular Aluno) ---
      if (url.startsWith('/classes/') && url.endsWith('/students') && method === 'post') {
        await delay(150);
        const parts = url.split('/');
        const classId = parts[2];
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const studentId = body.studentId;

        if (!mockEnrollments[classId]) {
          mockEnrollments[classId] = [];
        }

        if (mockEnrollments[classId].includes(studentId)) {
          throw createMockError(400, 'Aluno já está matriculado nesta turma.', config);
        }

        const currentClass = mockClasses.find(c => c.id === classId);
        const limit = currentClass?.vagasLimite || 50;
        if (mockEnrollments[classId].length >= limit) {
          throw createMockError(400, `Esta turma atingiu o limite de ${limit} vagas.`, config);
        }

        mockEnrollments[classId].push(studentId);

        config.adapter = async () => ({
          data: { success: true },
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- DELETE /classes/:classId/students/:studentId (Desmatricular Aluno) ---
      if (url.startsWith('/classes/') && url.includes('/students/') && method === 'delete') {
        await delay(150);
        const parts = url.split('/');
        const classId = parts[2];
        const studentId = parts[4];

        if (mockEnrollments[classId]) {
          mockEnrollments[classId] = mockEnrollments[classId].filter(id => id !== studentId);
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

      // --- GET /attendance ---
      if (url.startsWith('/attendance') && method === 'get') {
        await delay(150);
        const params = new URLSearchParams(url.split('?')[1] || '');
        const classId = params.get('classId') || '';
        const date = params.get('date') || '';

        const studentIds = mockEnrollments[classId] || [];
        const enrolledStudents = mockStudents.filter((s) => studentIds.includes(s.id));

        const result = enrolledStudents.map((student) => {
          const attendance = mockAttendances.find(
            (a) => a.classId === classId && a.studentId === student.id && a.date === date
          );
          return {
            studentId: student.id,
            studentName: student.name,
            status: attendance ? attendance.status : null,
            observacao: attendance ? attendance.observacao : null,
            justificativaDetalhes: attendance ? attendance.justificativaDetalhes : null,
          };
        });

        config.adapter = async () => ({
          data: result,
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
        const parts = url.split('/');
        const classId = parts[2];
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const { date, attendances } = body;

        attendances.forEach((att: any) => {
          mockAttendances = mockAttendances.filter(
            (a) => !(a.classId === classId && a.studentId === att.studentId && a.date === date)
          );

          mockAttendances.push({
            classId,
            studentId: att.studentId,
            date,
            status: att.status,
            observacao: att.justification || null,
            justificativaDetalhes: null,
          });
        });

        config.adapter = async () => ({
          data: { success: true, count: attendances.length },
          status: 200,
          statusText: 'OK',
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

      // --- GET /forms ---
      if (url === '/forms' && method === 'get') {
        await delay(100);
        config.adapter = async () => ({
          data: mockForms,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /forms ---
      if (url === '/forms' && method === 'post') {
        await delay(200);
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
        const newForm = {
          id: `f${mockForms.length + 1}`,
          title: body.title,
          description: body.description,
          fields: body.fields || [],
          createdAt: new Date().toISOString(),
        };
        mockForms.push(newForm);

        config.adapter = async () => ({
          data: newForm,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- GET /forms/:id/responses ---
      if (url.startsWith('/forms/') && url.endsWith('/responses') && method === 'get') {
        await delay(150);
        const parts = url.split('/');
        const formId = parts[2];
        const responses = mockFormResponses.filter((r) => r.formId === formId);

        config.adapter = async () => ({
          data: responses,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- POST /forms/:id/responses ---
      if (url.startsWith('/forms/') && url.endsWith('/responses') && method === 'post') {
        await delay(200);
        const parts = url.split('/');
        const formId = parts[2];
        const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;

        // Find student name from mockStudents
        const student = mockStudents.find((s) => s.id === body.studentId);

        const newResponse = {
          id: `r${mockFormResponses.length + 1}`,
          formId,
          studentId: body.studentId,
          studentName: student ? student.name : 'Aluno Desconhecido',
          answers: body.answers || {},
          createdAt: new Date().toISOString(),
        };
        mockFormResponses.push(newResponse);

        config.adapter = async () => ({
          data: newResponse,
          status: 201,
          statusText: 'Created',
          headers: {},
          config,
        });
        return config;
      }

      // --- GET /history/classes ---
      if (url === '/history/classes' && method === 'get') {
        await delay(100);
        config.adapter = async () => ({
          data: mockHistoryClasses,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        });
        return config;
      }

      // --- GET /history/instructors ---
      if (url === '/history/instructors' && method === 'get') {
        await delay(100);
        config.adapter = async () => ({
          data: mockHistoryInstructors,
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
