import type { DataSource } from 'typeorm'
import type { AttendanceRepository } from '@/application/services/attendance-repository'
import type { BaseDomain, Attendance } from '@/domain'
import { AttendanceEntity } from '../entity/attendance-entity'

export class AttendanceTypeormRepository implements AttendanceRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Attendance | null> {
    const repo = this.dataSource.getRepository(AttendanceEntity)
    const entity = await repo.findOne({ where: { id } })
    if (!entity) return null
    return this.toAttendance(entity)
  }

  async findByStudentClassAndDate(studentId: string, classId: string, date: Date): Promise<Attendance | null> {
    const repo = this.dataSource.getRepository(AttendanceEntity)
    const formattedDate = date.toISOString().split('T')[0]
    const entity = await repo
      .createQueryBuilder('attendance')
      .where('attendance.student_id = :studentId', { studentId })
      .andWhere('attendance.class_id = :classId', { classId })
      .andWhere('attendance.date = :formattedDate', { formattedDate })
      .getOne()

    if (!entity) return null
    return this.toAttendance(entity)
  }

  async findStudentAttendances(studentId: string, classId: string): Promise<Attendance[]> {
    const repo = this.dataSource.getRepository(AttendanceEntity)
    const entities = await repo.find({
      where: { studentId, classId },
      order: { date: 'ASC' },
    })
    return entities.map((e) => this.toAttendance(e))
  }

  async save(data: Omit<Attendance, keyof BaseDomain>): Promise<Attendance> {
    const repo = this.dataSource.getRepository(AttendanceEntity)
    const existing = await this.findByStudentClassAndDate(data.studentId, data.classId, data.date)
    if (existing) {
      await repo.update(
        { id: existing.id },
        {
          status: data.status,
          observacao: data.observacao,
          justificativaDetalhes: data.justificativaDetalhes,
        }
      )
      const updated = await repo.findOneByOrFail({ id: existing.id })
      return this.toAttendance(updated)
    }

    const saved = await repo.save(repo.create(data))
    return this.toAttendance(saved)
  }

  async deleteById(id: string): Promise<void> {
    const repo = this.dataSource.getRepository(AttendanceEntity)
    await repo.delete({ id })
  }

  private toAttendance(entity: AttendanceEntity): Attendance {
    return {
      id: entity.id,
      classId: entity.classId,
      studentId: entity.studentId,
      date: new Date(entity.date),
      status: entity.status,
      observacao: entity.observacao,
      justificativaDetalhes: entity.justificativaDetalhes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    }
  }
}
