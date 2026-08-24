import { baseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ schema: 'public', name: 'users' })
export class users extends baseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 72, // BCrypt truncates input after 72 characters, so anything beyond that doesn't affect the hash
    nullable: false,
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 13,
    nullable: false
  })
  phone!: string

  @Column({
    type: 'boolean',
    default: true
  })
  active!: boolean
}
