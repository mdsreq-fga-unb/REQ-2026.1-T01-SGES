import type { DataSource } from 'typeorm'
import type { ClassRepository } from '@/application/services/class-repository'
import type { BaseDomain, Class } from '@/domain'
import { ClassEntity } from '../entity/class-entity'

export class ClassTypeormRepository implements ClassRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Class | null> {
    const repo = this.dataSource.getRepository(ClassEntity)
    const entity = await repo.findOne({ where: { id }, relations: ['instructors'] })
    if (!entity) return null
    return this.toClass(entity)
  }

  async findAll(page: number, limit: number): Promise<{ classes: Class[]; total: number }> {
    const repo = this.dataSource.getRepository(ClassEntity)
    const [entities, total] = await repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['instructors'],
    })
    return { classes: entities.map((e) => this.toClass(e)), total }
  }

  async save(data: Omit<Class, keyof BaseDomain>): Promise<Class> {
    const repo = this.dataSource.getRepository(ClassEntity)
    const saved = await repo.save(repo.create(data))
    const loaded = await repo.findOne({ where: { id: saved.id }, relations: ['instructors'] })
    return this.toClass(loaded!)
  }

  async findByDetails(nomeCurso: string, diaSemana: string, horario: string, excludeId?: string): Promise<Class | null> {
    const repo = this.dataSource.getRepository(ClassEntity)
    const qb = repo.createQueryBuilder('c')
      .leftJoinAndSelect('c.instructors', 'instructor')
      .where('c.nomeCurso = :nomeCurso', { nomeCurso })
      .andWhere('c.diaSemana = :diaSemana', { diaSemana })
      .andWhere('c.horario = :horario', { horario })
    if (excludeId) {
      qb.andWhere('c.id != :excludeId', { excludeId })
    }
    const entity = await qb.getOne()
    if (!entity) return null
    return this.toClass(entity)
  }

  async findInstructorClasses(instructorId: string): Promise<Class[]> {
    const repo = this.dataSource.getRepository(ClassEntity)
    const entities = await repo.createQueryBuilder('c')
      .leftJoinAndSelect('c.instructors', 'instructor')
      .where('instructor.id = :instructorId', { instructorId })
      .getMany()
    return entities.map((e) => this.toClass(e))
  }

  async deleteById(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(ClassEntity)
    await repo.delete({ id })
  }

  private toClass(entity: ClassEntity): Class {
    return {
      id: entity.id,
      nomeCurso: entity.nomeCurso,
      livrosEstudados: entity.livrosEstudados,
      horario: entity.horario,
      diaSemana: entity.diaSemana,
      vagasLimite: entity.vagasLimite,
      instructors: entity.instructors?.map((i) => ({
        id: i.id,
        registerCode: i.registerCode,
        name: i.name,
        email: i.email,
        password: i.password,
        role: i.role,
        resetCode: i.resetCode,
        resetCodeExpiresAt: i.resetCodeExpiresAt,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        deletedAt: i.deletedAt,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
