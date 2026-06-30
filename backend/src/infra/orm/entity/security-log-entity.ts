import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('security_logs')
export class SecurityLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  userId?: string | null

  @Column({ type: 'varchar' })
  action!: string

  @Column({ type: 'varchar', nullable: true })
  details?: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date
}
