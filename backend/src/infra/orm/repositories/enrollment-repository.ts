import type { DataSource } from 'typeorm'
import type { EnrollmentRepository } from '@/application/services/enrollment-repository'
import { EnrollmentStatus } from '@/domain'
import type { BaseDomain, Enrollment } from '@/domain'
import { EnrollmentEntity } from '../entity/enrollment-entity'

export class EnrollmentTypeormRepository implements EnrollmentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Enrollment | null> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const entity = await repo.findOne({ where: { id } })
    if (!entity) return null
    return this.toEnrollment(entity)
  }

  async findByStudentAndClass(studentId: string, classId: string): Promise<Enrollment | null> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const entity = await repo.findOne({ where: { studentId, classId } })
    if (!entity) return null
    return this.toEnrollment(entity)
  }

  async findActiveByClass(classId: string): Promise<Enrollment[]> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const entities = await repo.find({
      where: { classId, status: EnrollmentStatus.ACTIVE },
      order: { createdAt: 'ASC' },
    })
    return entities.map((e) => this.toEnrollment(e))
  }

  async countActiveEnrollmentsByClass(classId: string): Promise<number> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const count = await repo.count({ where: { classId, status: EnrollmentStatus.ACTIVE } })
    return count
  }

  async findAll(page: number, limit: number): Promise<{ enrollments: Enrollment[]; total: number }> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const [entities, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    })
    return { enrollments: entities.map((e) => this.toEnrollment(e)), total }
  }

  async getFunnelData(classId?: string): Promise<{ entered: number; active: number; evaded: number; completed: number }> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const query = repo.createQueryBuilder('enrollment')
      .select('enrollment.status', 'status')
      .addSelect('COUNT(enrollment.id)', 'count')
      .groupBy('enrollment.status')

    if (classId) {
      query.where('enrollment.class_id = :classId', { classId })
    }

    const results = await query.getRawMany()

    let active = 0
    let evaded = 0
    let completed = 0

    for (const row of results) {
      const count = parseInt(row.count, 10)
      if (row.status === EnrollmentStatus.ACTIVE) active = count
      else if (row.status === EnrollmentStatus.EVADED) evaded = count
      else if (row.status === EnrollmentStatus.COMPLETED) completed = count
    }

    const entered = active + evaded + completed

    return { entered, active, evaded, completed }
  }

  async save(data: Omit<Enrollment, keyof BaseDomain>): Promise<Enrollment> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    const saved = await repo.save(repo.create(data))
    return this.toEnrollment(saved)
  }

  async updateStatus(id: string, status: EnrollmentStatus): Promise<void> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    await repo.update({ id }, { status })
  }

  async deleteById(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(EnrollmentEntity)
    await repo.delete({ id })
  }

  private toEnrollment(entity: EnrollmentEntity): Enrollment {
    return {
      id: entity.id,
      studentId: entity.studentId,
      classId: entity.classId,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
