import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { users } from 'src/users/models/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Roles } from 'src/roles/models/roles.entity';
import { Permissions } from 'src/permissions/models/permissions.entity';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PermissionsModule,
    TypeOrmModule.forFeature([users, Roles, Permissions]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
