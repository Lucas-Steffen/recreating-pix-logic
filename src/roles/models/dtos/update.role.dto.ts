import { PartialType } from '@nestjs/swagger';
import { createRoleDto } from './create.role.dto';

export class updateRoleDto extends PartialType(createRoleDto) {}
