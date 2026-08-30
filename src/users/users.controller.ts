import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { createUserDto } from './models/dtos/create.user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService
  ) {}
}
