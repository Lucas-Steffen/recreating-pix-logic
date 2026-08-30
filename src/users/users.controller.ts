import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { searchUsersDto } from './models/dtos/search.users.dto';
import {
  AppAbility,
  CheckPolicies,
} from 'src/auth/decorators/check.policies.decorator';
import { Action } from 'src/auth/models/enums/casl.action';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('search')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'manage'))
  async search(@Query() query: searchUsersDto) {
    return this.userService.searchUsers(query);
  }
}
