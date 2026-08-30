import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Users } from './user.entity';

@Entity({ schema: 'public', name: 'user_search_tokens' })
@Unique(['userId', 'tokenHash'])
export class UserSearchToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: false })
  tokenHash: string;
}
