import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permissions } from './models/permissions.entity';
import { Roles } from 'src/roles/models/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions, Roles])],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {}
