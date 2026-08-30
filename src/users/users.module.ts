import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/roles/models/roles.entity';
import { Users } from './models/user.entity';
import { UserSearchToken } from './models/user-search-token.entity';
import { KmsModule } from 'src/kms/kms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, UserSearchToken]),
    KmsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
