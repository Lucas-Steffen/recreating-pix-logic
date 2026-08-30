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
import { RolesService } from './roles.service';
import { Check } from 'typeorm';
import {
  AppAbility,
  CheckPolicies,
} from 'src/auth/decorators/check.policies.decorator';
import { Action } from 'src/auth/models/enums/casl.action';
import { queryObjects } from 'v8';
import { QueryRolesDto } from './models/dtos/query.role.dto';
import { Ability } from '@casl/ability';
import { createRoleDto } from './models/dtos/create.role.dto';
import { updateRoleDto } from './models/dtos/update.role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get('')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async getRoles(@Query() query: QueryRolesDto) {
    return this.roleService.getRoles(query);
  }

  @Post('')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async createRole(@Body() body: createRoleDto) {
    return this.roleService.createRole(body);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async updateRole(@Param('id') id: string, @Body() body: updateRoleDto) {
    return this.roleService.updateRole(id, body);
  }

  @Delete('id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async deleteRole(@Param('id') id: string) {
    return this.roleService;
  }
}
