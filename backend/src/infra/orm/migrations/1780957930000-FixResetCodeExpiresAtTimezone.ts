import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixResetCodeExpiresAtTimezone1780957930000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users'
            AND column_name = 'reset_code_expires_at'
            AND data_type = 'timestamp without time zone'
        ) THEN
          ALTER TABLE users
            ALTER COLUMN reset_code_expires_at TYPE TIMESTAMPTZ
              USING reset_code_expires_at AT TIME ZONE 'UTC';
        END IF;
      END $$;
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users'
            AND column_name = 'reset_code_expires_at'
            AND data_type = 'timestamp with time zone'
        ) THEN
          ALTER TABLE users
            ALTER COLUMN reset_code_expires_at TYPE TIMESTAMP
              USING reset_code_expires_at AT TIME ZONE 'UTC';
        END IF;
      END $$;
    `)
  }
}
