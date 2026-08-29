import { Roles } from "src/roles/models/roles.entity";
import { baseEntity } from "src/shared/entities/base.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity({ schema: 'public', name: 'permissions'})
export class Permissions extends baseEntity {
    @Column({
        type: 'varchar',
        length: 255
    })
    action: string

    @Column({
        type: 'varchar',
        length: 255
    })
    subject: string;

    @ManyToMany(() => Roles, (roles) => roles.permissions)
    roles: Roles[]
}