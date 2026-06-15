import type { BaseDomain, Notification } from '@/domain'

export interface NotificationRepository {
  findById(id: string): Promise<Notification | null>
  findAllByUser(userId: string): Promise<Notification[]>
  save(data: Omit<Notification, keyof BaseDomain>): Promise<Notification>
  markAsRead(id: string): Promise<void>
  deleteById(id: string): Promise<void>
}
