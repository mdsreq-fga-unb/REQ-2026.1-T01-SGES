import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddResetCodeToUsers1780857930000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS reset_code VARCHAR,
        ADD COLUMN IF NOT EXISTS reset_code_expires_at TIMESTAMPTZ
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
        DROP COLUMN IF EXISTS reset_code,
        DROP COLUMN IF EXISTS reset_code_expires_at
    `)
  }
}
