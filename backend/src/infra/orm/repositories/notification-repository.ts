import type { DataSource } from 'typeorm'
import type { NotificationRepository } from '@/application/services/notification-repository'
import type { BaseDomain, Notification } from '@/domain'
import { NotificationEntity } from '../entity/notification-entity'

export class NotificationTypeormRepository implements NotificationRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Notification | null> {
    const repo = this.dataSource.getRepository(NotificationEntity)
    const entity = await repo.findOne({ where: { id } })
    if (!entity) return null
    return this.toNotification(entity)
  }

  async findAllByUser(userId: string): Promise<Notification[]> {
    const repo = this.dataSource.getRepository(NotificationEntity)
    const entities = await repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
    return entities.map((e) => this.toNotification(e))
  }

  async save(data: Omit<Notification, keyof BaseDomain>): Promise<Notification> {
    const repo = this.dataSource.getRepository(NotificationEntity)
    const saved = await repo.save(repo.create(data))
    return this.toNotification(saved)
  }

  async markAsRead(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(NotificationEntity)
    await repo.update({ id }, { isRead: true })
  }

  async deleteById(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(NotificationEntity)
    await repo.delete({ id })
  }

  private toNotification(entity: NotificationEntity): Notification {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      message: entity.message,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
