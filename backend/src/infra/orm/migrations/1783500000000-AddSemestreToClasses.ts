import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSemestreToClasses1783500000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "classes",
      new TableColumn({
        name: "semestre",
        type: "varchar",
        isNullable: true,
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("classes", "semestre");
  }
}
