import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './models/dtos/login.dto';
import { Repository } from 'typeorm';
import { users } from 'src/users/models/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(users)
    private readonly userRepository: Repository<users>,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedException(`Email or password invalid!`);
    }

    if (existingUser.active === false) {
      throw new UnauthorizedException(
        `Your user is inactive. Contact our Relationship center`,
      );
    }

    const validatePassword = await bcrypt.compare(
      body.password,
      existingUser.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException(`Email or password invalid!`);
    }

    const payload: JwtPayload = {
      sub: existingUser.id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_KEY,
      }),
    };
  }
}
