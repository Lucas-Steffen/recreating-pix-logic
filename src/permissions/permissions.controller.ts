import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { AppAbility, CheckPolicies } from 'src/auth/decorators/check.policies.decorator';
import { Action } from 'src/auth/models/enums/casl.action';
import { createPermissionsDto } from './models/dtos/create.permissions.dto';
import { QueryPermissionsDto } from './models/dtos/query.permissions.dto';

@Controller('permissions')
export class PermissionsController {
    constructor(
        private readonly permissionsService: PermissionsService
    ){}

    @Get()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "manage"))
    async getAllPermissions(@Query() query: QueryPermissionsDto){
        return this.permissionsService.getPermissions(query)
    }

    @Post()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, "manage"))
    async createPermission(@Body() body: createPermissionsDto){
        return this.permissionsService.createPermissions(body)
    }
}
