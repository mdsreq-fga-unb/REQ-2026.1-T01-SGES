import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { UserRole } from '@/domain'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'register_code', type: 'varchar' })
  registerCode!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ unique: true, type: 'varchar' })
  email!: string

  @Column({ type: 'varchar' })
  password!: string

  @Column({ type: 'enum', enum: UserRole })
  role!: UserRole

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date

  @Column({ name: 'reset_code', type: 'varchar', nullable: true })
  resetCode?: string | null

  @Column({ name: 'reset_code_expires_at', type: 'timestamptz', nullable: true })
  resetCodeExpiresAt?: Date | null
}
