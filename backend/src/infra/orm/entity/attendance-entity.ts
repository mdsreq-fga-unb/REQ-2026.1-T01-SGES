import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { AttendanceStatus } from '@/domain'
import { ClassEntity } from './class-entity'
import { StudentEntity } from './student-entity'

@Entity('attendances')
export class AttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'class_id', type: 'uuid' })
  classId!: string

  @ManyToOne(() => ClassEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: ClassEntity

  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string

  @ManyToOne(() => StudentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity

  @Column({ type: 'date' })
  date!: Date

  @Column({ type: 'enum', enum: AttendanceStatus })
  status!: AttendanceStatus

  @Column({ type: 'varchar', nullable: true })
  observacao?: string | null

  @Column({ name: 'justificativa_detalhes', type: 'varchar', nullable: true })
  justificativaDetalhes?: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}
