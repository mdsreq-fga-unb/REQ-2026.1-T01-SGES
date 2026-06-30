import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSecurityLogsTable1782200000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS security_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR,
        action VARCHAR NOT NULL,
        details VARCHAR,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      )
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS security_logs`)
  }
}
