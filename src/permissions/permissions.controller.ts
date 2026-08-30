import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  AppAbility,
  CheckPolicies,
} from 'src/auth/decorators/check.policies.decorator';
import { Action } from 'src/auth/models/enums/casl.action';
import { createPermissionsDto } from './models/dtos/create.permissions.dto';
import { QueryPermissionsDto } from './models/dtos/query.permissions.dto';
import { updatePermissionDto } from './models/dtos/update.permissions.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async getAllPermissions(@Query() query: QueryPermissionsDto) {
    return this.permissionsService.getPermissions(query);
  }

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async createPermission(@Body() body: createPermissionsDto) {
    return this.permissionsService.createPermissions(body);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async updatePermission(
    @Param('id') id: string,
    @Body() body: updatePermissionDto,
  ) {
    return this.permissionsService.updatePermission(id, body);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async deletePermission(@Param('id') id: string) {
    return this.permissionsService.deletePermission(id);
  }
}
