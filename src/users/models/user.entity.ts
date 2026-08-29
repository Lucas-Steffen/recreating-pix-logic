import { Roles } from 'src/roles/models/roles.entity';
import { baseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'users' })
export class users extends baseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 72, // BCrypt truncates input after 72 characters, so anything beyond that doesn't affect the hash
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 13,
    nullable: false
  })
  phone: string

  @Column({
    type: 'boolean',
    default: true
  })
  active: boolean

  @ManyToMany(() => Roles, (roles) => roles.usuarios)
  roles: Roles[];
}
