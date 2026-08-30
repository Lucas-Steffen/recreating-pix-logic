import { Auditable } from 'src/logs/decorators/logs.decorator';
import { Permissions } from 'src/permissions/models/permissions.entity';
import { baseEntity } from 'src/shared/entities/base.entity';
import { Users } from 'src/users/models/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'roles' })
@Auditable({ entity: 'roles' })
export class Roles extends baseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  role: string;

  @ManyToMany(() => Users, (user) => user.roles)
  @JoinTable()
  users: Users[];

  @ManyToMany(() => Permissions, (permissions) => permissions.roles)
  @JoinTable()
  permissions: Permissions[];
}
