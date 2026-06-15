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

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'FT';

export interface AttendanceInput {
  studentId: string;
  status: AttendanceStatus;
  justification?: string;
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

  async saveAttendance(classId: string, date: string, attendances: AttendanceInput[]): Promise<void> {
    await apiClient.post(`/classes/${classId}/attendances`, {
      date,
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
    const { data } = await apiClient.get<{ users: UserDto[] }>('/users');
    return data;
  },

  async create(input: { name: string; email: string; role: 'admin' | 'volunteer' }): Promise<UserDto> {
    const { data } = await apiClient.post<UserDto>('/users', input);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
