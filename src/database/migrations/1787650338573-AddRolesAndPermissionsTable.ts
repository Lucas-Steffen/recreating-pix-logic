import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRolesAndPermissionsTable1787650338573 implements MigrationInterface {
  name = 'AddRolesAndPermissionsTable1787650338573';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "role" character varying(255) NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "action" character varying(255) NOT NULL, "subject" character varying(255) NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_usuarios_users" ("rolesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_f59ce772719533bc4221edf6f21" PRIMARY KEY ("rolesId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d19fdc883a08dd129e3cffdc4e" ON "roles_usuarios_users"  ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_81eaf87754f63968b1829eb98b" ON "roles_usuarios_users"  ("usersId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "roles_permissions_permissions" ("rolesId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_b2f4e3f7fbeb7e5b495dd819842" PRIMARY KEY ("rolesId", "permissionsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc2b9d46195bb3ed28abbf7c9e" ON "roles_permissions_permissions"  ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd4d5d4c7f7ff16c57549b72c6" ON "roles_permissions_permissions"  ("permissionsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_usuarios_users" ADD CONSTRAINT "FK_d19fdc883a08dd129e3cffdc4e2" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_usuarios_users" ADD CONSTRAINT "FK_81eaf87754f63968b1829eb98b4" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" ADD CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_fd4d5d4c7f7ff16c57549b72c6f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_permissions_permissions" DROP CONSTRAINT "FK_dc2b9d46195bb3ed28abbf7c9e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_usuarios_users" DROP CONSTRAINT "FK_81eaf87754f63968b1829eb98b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_usuarios_users" DROP CONSTRAINT "FK_d19fdc883a08dd129e3cffdc4e2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd4d5d4c7f7ff16c57549b72c6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc2b9d46195bb3ed28abbf7c9e"`,
    );
    await queryRunner.query(`DROP TABLE "roles_permissions_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_81eaf87754f63968b1829eb98b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d19fdc883a08dd129e3cffdc4e"`,
    );
    await queryRunner.query(`DROP TABLE "roles_usuarios_users"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
