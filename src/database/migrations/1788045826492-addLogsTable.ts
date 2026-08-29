import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogsTable1788045826492 implements MigrationInterface {
    name = 'AddLogsTable1788045826492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."logs_action_enum" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE')`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "entity_name" character varying(100) NOT NULL, "entity_id" uuid NOT NULL, "action" "public"."logs_action_enum" NOT NULL, "correlation_id" uuid, "actor_id" uuid, "actor_role" character varying(100), "actor_name" character varying(255), "previous_state" jsonb, "changed_fields" jsonb, "new_state" jsonb, "ip_address" character varying(50), "user_agent" character varying(500), "http_method" character varying(10), "http_path" character varying(500), "observation" character varying(1000), CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc6f031075857a0e798642f503" ON "logs"  ("correlation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1d21181bfc9b5cc798be90d723" ON "logs"  ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_4966f94de86ae30f0fc8d2f415" ON "logs"  ("actor_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b08f143d4f48e93ea97eaeadf5" ON "logs"  ("entity_name", "entity_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b08f143d4f48e93ea97eaeadf5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4966f94de86ae30f0fc8d2f415"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d21181bfc9b5cc798be90d723"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc6f031075857a0e798642f503"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TYPE "public"."logs_action_enum"`);
    }

}
