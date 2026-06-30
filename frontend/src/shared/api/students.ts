import { apiClient } from './client';

export interface StudentDto {
  id: string;
  codigo_matricula: string;
  name: string;
  email: string;
  profissao: string;
  createdAt: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  profissao: string;
}

export const studentsApi = {
  async getAll(): Promise<StudentDto[]> {
    const { data } = await apiClient.get<StudentDto[]>('/students');
    return data;
  },

  async create(input: CreateStudentInput): Promise<StudentDto> {
    const { data } = await apiClient.post<StudentDto>('/students', input);
    return data;
  },

  async update(id: string, input: Partial<CreateStudentInput>): Promise<StudentDto> {
    const { data } = await apiClient.put<StudentDto>(`/students/${id}`, input);
    return data;
  },
};
