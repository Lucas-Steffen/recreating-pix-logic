import { Auditable } from 'src/logs/decorators/logs.decorator';
import { Roles } from 'src/roles/models/roles.entity';
import { baseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ schema: 'public', name: 'users' })
@Auditable({ entity: 'users', ignore: ['password'] })
export class Users extends baseEntity {
  // Name, email and phone live encrypted inside piiCiphertext (KMS envelope
  // encryption) and are only available in memory after decryption — they are
  // intentionally not @Column-mapped.
  name: string;
  email: string;
  phone: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  piiCiphertext: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  dataKeyCiphertext: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  emailBlindIndex: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  phoneBlindIndex: string;

  @Column({
    type: 'varchar',
    length: 72, // BCrypt truncates input after 72 characters, so anything beyond that doesn't affect the hash
    nullable: false,
  })
  password: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;

  @ManyToMany(() => Roles, (roles) => roles.users)
  roles: Roles[];
}
