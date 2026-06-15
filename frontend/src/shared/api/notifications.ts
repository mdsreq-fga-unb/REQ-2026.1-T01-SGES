import { apiClient } from './client';

export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  async getAll(): Promise<NotificationDto[]> {
    const { data } = await apiClient.get<NotificationDto[]>('/notifications');
    return data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/notifications/${id}/read`);
  },
};
