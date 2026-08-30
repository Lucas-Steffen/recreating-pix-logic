import { MigrationInterface, QueryRunner } from 'typeorm';

// Additive step of a two-phase rollout: adds the KMS-encrypted PII columns
// and the tokenized blind-index table for name search, while keeping the old
// plaintext "name"/"email"/"phone" columns in place. Run the backfill script
// (src/database/scripts/backfill-user-pii.script.ts) against existing rows,
// then apply DropPlaintextPiiFromUsers to finish the rollout.
export class AddPiiEncryptionToUsers1788124125191 implements MigrationInterface {
  name = 'AddPiiEncryptionToUsers1788124125191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "piiCiphertext" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "dataKeyCiphertext" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailBlindIndex" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phoneBlindIndex" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_users_emailBlindIndex" UNIQUE ("emailBlindIndex")`,
    );

    await queryRunner.query(
      `CREATE TABLE "user_search_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "tokenHash" character varying(255) NOT NULL, CONSTRAINT "UQ_user_search_tokens_userId_tokenHash" UNIQUE ("userId", "tokenHash"), CONSTRAINT "PK_user_search_tokens_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_search_tokens_tokenHash" ON "user_search_tokens" ("tokenHash")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_search_tokens" ADD CONSTRAINT "FK_user_search_tokens_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_search_tokens" DROP CONSTRAINT "FK_user_search_tokens_userId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_user_search_tokens_tokenHash"`,
    );
    await queryRunner.query(`DROP TABLE "user_search_tokens"`);

    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_users_emailBlindIndex"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneBlindIndex"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailBlindIndex"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dataKeyCiphertext"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "piiCiphertext"`);
  }
}
