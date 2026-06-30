import type { DataSource } from 'typeorm'
import type { SecurityLogRepository } from '@/application/services/security-log-repository'
import { SecurityLogEntity } from '../entity/security-log-entity'

export class SecurityLogTypeormRepository implements SecurityLogRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save(data: { userId?: string | null; action: string; details?: string | null }): Promise<void> {
    const repo = this.dataSource.getRepository(SecurityLogEntity)
    await repo.save(repo.create(data))
  }
}
