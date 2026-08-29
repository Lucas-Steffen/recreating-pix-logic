import { Permissions } from "src/permissions/models/permissions.entity";
import { baseEntity } from "src/shared/entities/base.entity";
import { users } from "src/users/models/user.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity({ schema: 'public', name: 'roles' })
export class Roles extends baseEntity {
    @Column({
        type: "varchar",
        length: 255,
        nullable: false
    })
    role: string;

    @ManyToMany(() => users, (usuarios) => usuarios.roles)
    @JoinTable()
    usuarios: users[];

    @ManyToMany(() => Permissions, (permissions) => permissions.roles)
    @JoinTable()
    permissions: Permissions[];
}