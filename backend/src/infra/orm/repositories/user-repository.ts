import type { DataSource } from 'typeorm'
import type { UserRepository } from '@/application/services/user-repository'
import type { BaseDomain, User } from '@/domain'
import { UserEntity } from '../entity/user-entity'

export class UserTypeormRepository implements UserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByEmail(email: string): Promise<User | null> {
    const repo = this.dataSource.getRepository(UserEntity)
    const entity = await repo.findOne({ where: { email } })

    if (!entity) return null

    return this.toUser(entity)
  }

  async save(data: Omit<User, keyof BaseDomain>): Promise<User> {
    const repo = this.dataSource.getRepository(UserEntity)
    const saved = await repo.save(repo.create(data))
    return this.toUser(saved)
  }

  async updateResetCode(email: string, code: string | null, expiresAt: Date | null): Promise<void> {
    const repo = this.dataSource.getRepository(UserEntity)
    await repo.update({ email }, { resetCode: code, resetCodeExpiresAt: expiresAt })
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    const repo = this.dataSource.getRepository(UserEntity)
    await repo.update({ email }, { password: hashedPassword })
  }

  private toUser(entity: UserEntity): User {
    return {
      id: entity.id,
      registerCode: entity.registerCode,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      role: entity.role,
      resetCode: entity.resetCode,
      resetCodeExpiresAt: entity.resetCodeExpiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
