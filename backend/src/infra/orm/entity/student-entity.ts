import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'codigo_matricula', type: 'varchar', unique: true })
  codigoMatricula!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', nullable: true })
  email?: string | null

  @Column({ type: 'varchar', nullable: true })
  profissao?: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}
