import type { DataSource } from 'typeorm'
import type { InstructorHistoryRepository } from '@/application/services/instructor-history-repository'
import type { BaseDomain, InstructorHistory } from '@/domain'
import { InstructorHistoryEntity } from '../entity/instructor-history-entity'

export class InstructorHistoryTypeormRepository implements InstructorHistoryRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<InstructorHistory | null> {
    const repo = this.dataSource.getRepository(InstructorHistoryEntity)
    const entity = await repo.findOne({ where: { id }, relations: ['instructor', 'class'] })
    if (!entity) return null
    return this.toInstructorHistory(entity)
  }

  async findBySemesterOrYear(semester?: string, year?: number): Promise<InstructorHistory[]> {
    const repo = this.dataSource.getRepository(InstructorHistoryEntity)
    const query = repo
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.instructor', 'instructor')
      .leftJoinAndSelect('history.class', 'class')

    if (semester) {
      query.andWhere('history.semestre = :semester', { semester })
    }
    if (year) {
      query.andWhere('history.ano = :year', { year })
    }

    const entities = await query.getMany()
    return entities.map((e) => this.toInstructorHistory(e))
  }

  async save(data: Omit<InstructorHistory, keyof BaseDomain>): Promise<InstructorHistory> {
    const repo = this.dataSource.getRepository(InstructorHistoryEntity)
    const saved = await repo.save(repo.create(data))
    const loaded = await repo.findOne({ where: { id: saved.id }, relations: ['instructor', 'class'] })
    return this.toInstructorHistory(loaded!)
  }

  async deleteById(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(InstructorHistoryEntity)
    await repo.delete({ id })
  }

  private toInstructorHistory(entity: InstructorHistoryEntity): InstructorHistory {
    return {
      id: entity.id,
      instructorId: entity.instructorId,
      classId: entity.classId,
      semestre: entity.semestre,
      ano: entity.ano,
      instructorName: entity.instructor?.name,
      courseName: entity.class?.nomeCurso,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    } as any
  }
}
