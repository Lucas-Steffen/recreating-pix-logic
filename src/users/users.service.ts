import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { users } from './models/user.entity';
import { createUserDto } from './models/dtos/create.user.dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { Roles } from 'src/roles/models/roles.entity';

const POSTGRES_UNIQUE_VIOLATION = '23505';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(users)
    private readonly userRepository: Repository<users>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async signup(body: createUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('E-mail already exists');
    }

    const role = await this.rolesRepository.findOne({
      where: {
        role: body.role,
      },
    });

    if (!role) {
      throw new NotFoundException(`Cannot link ${body.email} to ${body.role}`);
    }

    const newUser = new users();
    newUser.name = body.name;
    newUser.email = body.email;
    newUser.phone = body.phone;
    newUser.password = await bcrypt.hash(
      body.password,
      +process.env.BCRYPT_SALT!,
    );
    newUser.roles = [role];

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      if (this.isUniqueEmailViolation(error)) {
        throw new ConflictException('E-mail already exists');
      }
      throw error;
    }

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  private isUniqueEmailViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string })?.code ===
        POSTGRES_UNIQUE_VIOLATION
    );
  }
}
