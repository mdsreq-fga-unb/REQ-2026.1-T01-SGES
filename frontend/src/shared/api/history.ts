import { apiClient } from './client';

export interface HistoryClassDto {
  id: string;
  name: string;
  semester: string;
  teacherName: string;
  enrolledCount: number;
  evadedCount: number;
  completedCount: number;
}

export interface HistoryInstructorDto {
  id: string;
  teacherName: string;
  className: string;
  semester: string;
  hoursCount: number;
}

export const historyApi = {
  async getClasses(): Promise<HistoryClassDto[]> {
    const { data } = await apiClient.get<HistoryClassDto[]>('/history/classes');
    return data;
  },

  async getInstructors(): Promise<HistoryInstructorDto[]> {
    const { data } = await apiClient.get<HistoryInstructorDto[]>('/history/instructors');
    return data;
  },
};
