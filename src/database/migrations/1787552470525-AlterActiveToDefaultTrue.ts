import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterActiveToDefaultTrue1787552470525 implements MigrationInterface {
  name = 'AlterActiveToDefaultTrue1787552470525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "active" SET DEFAULT false`,
    );
  }
}
