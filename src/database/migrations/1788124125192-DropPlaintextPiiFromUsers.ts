import { MigrationInterface, QueryRunner } from 'typeorm';

// Cleanup step of the two-phase rollout: only run this after
// AddPiiEncryptionToUsers has been applied and the backfill script has
// populated piiCiphertext/dataKeyCiphertext/emailBlindIndex/phoneBlindIndex
// for every existing row. "down" cannot recover the dropped plaintext values.
export class DropPlaintextPiiFromUsers1788124125192 implements MigrationInterface {
  name = 'DropPlaintextPiiFromUsers1788124125192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "piiCiphertext" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "dataKeyCiphertext" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "emailBlindIndex" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phoneBlindIndex" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone" character varying(13)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "phoneBlindIndex" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "emailBlindIndex" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "dataKeyCiphertext" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "piiCiphertext" DROP NOT NULL`,
    );
  }
}
