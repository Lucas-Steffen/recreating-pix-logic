import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { users } from './models/user.entity';
import { Roles } from 'src/roles/models/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([users, Roles])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
