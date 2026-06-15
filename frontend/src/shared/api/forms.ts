import { apiClient } from './client';

export interface FormField {
  id: string;
  type: 'text' | 'select';
  label: string;
  options?: string[];
  required: boolean;
}

export interface FormDto {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormResponseDto {
  id: string;
  formId: string;
  studentId: string;
  studentName: string;
  answers: { [fieldId: string]: string };
  createdAt: string;
}

export const formsApi = {
  async getAll(): Promise<FormDto[]> {
    const { data } = await apiClient.get<FormDto[]>('/forms');
    return data;
  },

  async create(title: string, description: string, fields: FormField[]): Promise<FormDto> {
    const { data } = await apiClient.post<FormDto>('/forms', { title, description, fields });
    return data;
  },

  async getResponses(formId: string): Promise<FormResponseDto[]> {
    const { data } = await apiClient.get<FormResponseDto[]>(`/forms/${formId}/responses`);
    return data;
  },

  async submitResponse(formId: string, studentId: string, answers: { [fieldId: string]: string }): Promise<void> {
    await apiClient.post(`/forms/${formId}/responses`, { studentId, answers });
  },
};
