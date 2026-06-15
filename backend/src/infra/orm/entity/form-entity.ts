import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { FormAnswer, FormQuestion } from '@/domain'
import { StudentEntity } from './student-entity'

@Entity('forms')
export class FormEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  title!: string

  @Column({ type: 'varchar', nullable: true })
  description?: string | null

  @Column({ type: 'jsonb' })
  questions!: FormQuestion[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}

@Entity('form_responses')
export class FormResponseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'form_id', type: 'uuid' })
  formId!: string

  @ManyToOne(() => FormEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'form_id' })
  form!: FormEntity

  @Column({ name: 'student_id', type: 'uuid' })
  studentId!: string

  @ManyToOne(() => StudentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: StudentEntity

  @Column({ type: 'jsonb' })
  answers!: FormAnswer[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}
