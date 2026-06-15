import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { UserEntity } from './user-entity'
import { ClassEntity } from './class-entity'

@Entity('instructor_history')
export class InstructorHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'instructor_id', type: 'uuid' })
  instructorId!: string

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instructor_id' })
  instructor!: UserEntity

  @Column({ name: 'class_id', type: 'uuid' })
  classId!: string

  @ManyToOne(() => ClassEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: ClassEntity

  @Column({ type: 'varchar' })
  semestre!: string

  @Column({ type: 'integer' })
  ano!: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}
