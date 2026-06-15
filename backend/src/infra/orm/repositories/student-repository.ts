import type { DataSource } from 'typeorm'
import type { StudentRepository } from '@/application/services/student-repository'
import type { BaseDomain, Student } from '@/domain'
import { StudentEntity } from '../entity/student-entity'

export class StudentTypeormRepository implements StudentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Student | null> {
    const repo = this.dataSource.getRepository(StudentEntity)
    const entity = await repo.findOne({ where: { id } })
    if (!entity) return null
    return this.toStudent(entity)
  }

  async findByCodigoMatricula(codigoMatricula: string): Promise<Student | null> {
    const repo = this.dataSource.getRepository(StudentEntity)
    const entity = await repo.findOne({ where: { codigoMatricula } })
    if (!entity) return null
    return this.toStudent(entity)
  }

  async findAll(page: number, limit: number): Promise<{ students: Student[]; total: number }> {
    const repo = this.dataSource.getRepository(StudentEntity)
    const [entities, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    })
    return { students: entities.map((e) => this.toStudent(e)), total }
  }

  async save(data: Omit<Student, keyof BaseDomain>): Promise<Student> {
    const repo = this.dataSource.getRepository(StudentEntity)
    const saved = await repo.save(repo.create(data))
    return this.toStudent(saved)
  }

  async deleteById(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(StudentEntity)
    await repo.delete({ id })
  }

  private toStudent(entity: StudentEntity): Student {
    return {
      id: entity.id,
      codigoMatricula: entity.codigoMatricula,
      name: entity.name,
      email: entity.email,
      profissao: entity.profissao,
      fotoUrl: entity.fotoUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
