import { apiClient } from './client';
import type { StudentDto } from './students';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'volunteer';
}

export interface ClassDto {
  id: string;
  nomeCurso: string;
  livrosEstudados?: string | null;
  horario: string;
  diaSemana: string;
  vagasLimite?: number | null;
  semester: string;
  instructors?: UserDto[];
  studentsCount?: number;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'JUSTIFIED' | 'FT';

export interface AttendanceInput {
  studentId: string;
  status: AttendanceStatus;
  justification?: string;
}

export interface AttendanceEntryDto {
  studentId: string;
  studentName: string;
  status: AttendanceStatus | null;
  observacao: string | null;
  justificativaDetalhes: string | null;
}

export const classesApi = {
  async getAll(): Promise<ClassDto[]> {
    const { data } = await apiClient.get<ClassDto[]>('/classes');
    return data;
  },

  async getStudents(classId: string): Promise<StudentDto[]> {
    const { data } = await apiClient.get<StudentDto[]>(`/classes/${classId}/students`);
    return data;
  },

  async getAttendance(classId: string, date: string): Promise<AttendanceEntryDto[]> {
    const { data } = await apiClient.get<AttendanceEntryDto[]>('/attendance', {
      params: { classId, date },
    });
    return data;
  },

  async saveAttendance(classId: string, date: string, attendances: AttendanceInput[]): Promise<void> {
    await apiClient.post(`/classes/${classId}/attendances`, {
      date,
      attendances,
    });
  },

  async updateAttendance(classId: string, date: string, justificativaDetalhes: string, attendances: AttendanceInput[]): Promise<void> {
    await apiClient.put(`/classes/${classId}/attendances`, {
      date,
      justificativaDetalhes,
      attendances,
    });
  },

  async create(input: {
    nomeCurso: string;
    livrosEstudados?: string | null;
    horario: string;
    diaSemana: string;
    vagasLimite?: number | null;
    instructorIds?: string[];
  }): Promise<ClassDto> {
    const { data } = await apiClient.post<ClassDto>('/classes', input);
    return data;
  },

  async update(classId: string, input: {
    nomeCurso: string;
    livrosEstudados?: string | null;
    horario: string;
    diaSemana: string;
    vagasLimite?: number | null;
    instructorIds?: string[];
  }): Promise<ClassDto> {
    const { data } = await apiClient.put<ClassDto>(`/classes/${classId}`, input);
    return data;
  },

  async delete(classId: string): Promise<void> {
    await apiClient.delete(`/classes/${classId}`);
  },

  async enrollStudent(classId: string, studentId: string): Promise<void> {
    await apiClient.post(`/classes/${classId}/students`, { studentId });
  },

  async unenrollStudent(classId: string, studentId: string): Promise<void> {
    await apiClient.delete(`/classes/${classId}/students/${studentId}`);
  },
};

export const usersApi = {
  async getAll(): Promise<{ users: UserDto[] }> {
    const { data } = await apiClient.get<{ users?: Array<{ id: string; name: string; email: string; role: string }>; data?: Array<{ id: string; name: string; email: string; role: string }> }>('/users');
    const rawList = data.users || data.data || [];
    const usersList = rawList.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: (u.role?.toLowerCase() === 'admin' ? 'admin' : 'volunteer') as 'admin' | 'volunteer',
    }));
    return { users: usersList };
  },

  async create(input: { name: string; email: string; role: 'admin' | 'volunteer' }): Promise<UserDto> {
    const backendRole = input.role === 'admin' ? 'ADMIN' : 'TEACHER';
    const { data } = await apiClient.post<{ id: string; name: string; email: string; role: string }>('/users', {
      ...input,
      role: backendRole,
    });
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role?.toLowerCase() === 'admin' ? 'admin' : 'volunteer',
    };
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async update(id: string, input: { name: string; email: string; role: 'admin' | 'volunteer' }): Promise<UserDto> {
    const backendRole = input.role === 'admin' ? 'ADMIN' : 'TEACHER';
    const { data } = await apiClient.put<{ id: string; name: string; email: string; role: string }>(`/users/${id}`, {
      ...input,
      role: backendRole,
    });
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role?.toLowerCase() === 'admin' ? 'admin' : 'volunteer',
    };
  },
};
