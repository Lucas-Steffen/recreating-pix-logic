import { PartialType } from '@nestjs/swagger';
import { createPermissionsDto } from './create.permissions.dto';

export class updatePermissionDto extends PartialType(createPermissionsDto) {}
