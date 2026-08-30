import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { createUserDto } from 'src/users/models/dtos/create.user.dto';
import { LoginDto } from './models/dtos/login.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService
    ) { }

    @Post('signup')
    @Public()
    async signup(@Body() body: createUserDto) {
        return this.userService.signup(body);
    }

    @Post('login')
    @Public()
    async login(@Body() body: LoginDto){
        return this.authService.login(body)
    }
}
