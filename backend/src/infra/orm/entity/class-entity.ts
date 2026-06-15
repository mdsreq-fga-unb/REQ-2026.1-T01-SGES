import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { UserEntity } from './user-entity'

@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ name: 'nome_curso', type: 'varchar' })
  nomeCurso!: string

  @Column({ name: 'livros_estudados', type: 'varchar', nullable: true })
  livrosEstudados?: string | null

  @Column({ type: 'varchar' })
  horario!: string

  @Column({ name: 'dia_semana', type: 'varchar' })
  diaSemana!: string

  @Column({ name: 'vagas_limite', type: 'integer', nullable: true })
  vagasLimite?: number | null

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'class_instructors',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  instructors!: UserEntity[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}
