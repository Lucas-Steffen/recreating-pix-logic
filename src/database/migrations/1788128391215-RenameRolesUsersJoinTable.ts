import { MigrationInterface, QueryRunner } from 'typeorm';

// The Roles<->Users join table was originally created as "roles_usuarios_users"
// (mixed Portuguese/English). Renames it to "roles_users" to match the rest
// of the codebase's English-only naming.
export class RenameRolesUsersJoinTable1788128391215
  implements MigrationInterface
{
  name = 'RenameRolesUsersJoinTable1788128391215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_usuarios_users" RENAME TO "roles_users"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_users" RENAME TO "roles_usuarios_users"`,
    );
  }
}
