import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEnrollmentTables1782000000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS students (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo_matricula VARCHAR NOT NULL UNIQUE,
        name VARCHAR NOT NULL,
        email VARCHAR,
        profissao VARCHAR,
        foto_url VARCHAR,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome_curso VARCHAR NOT NULL,
        livros_estudados VARCHAR,
        horario VARCHAR NOT NULL,
        dia_semana VARCHAR NOT NULL,
        vagas_limite INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS class_instructors (
        class_id UUID NOT NULL,
        user_id UUID NOT NULL,
        PRIMARY KEY (class_id, user_id)
      )
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE enrollment_status AS ENUM ('ACTIVE', 'EVADED', 'COMPLETED');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        status enrollment_status NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `)

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'JUSTIFIED', 'FT');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS attendances (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
        student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        status attendance_status NOT NULL,
        observacao VARCHAR,
        justificativa_detalhes VARCHAR,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR NOT NULL,
        message VARCHAR NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now(),
        deleted_at TIMESTAMP
      )
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`)
    await queryRunner.query(`DROP TABLE IF EXISTS attendances`)
    await queryRunner.query(`DROP TABLE IF EXISTS enrollments`)
    await queryRunner.query(`DROP TABLE IF EXISTS class_instructors`)
    await queryRunner.query(`DROP TABLE IF EXISTS classes`)
    await queryRunner.query(`DROP TABLE IF EXISTS students`)
    await queryRunner.query(`DROP TYPE IF EXISTS attendance_status`)
    await queryRunner.query(`DROP TYPE IF EXISTS enrollment_status`)
  }
}
