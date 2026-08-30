import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './models/dtos/login.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'types';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/roles/models/roles.entity';
import { Permissions } from 'src/permissions/models/permissions.entity';
import { RolesService } from 'src/roles/roles.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UsersService } from 'src/users/users.service';
import { Action } from './models/enums/casl.action';
import { Users } from 'src/users/models/user.entity';
import { BlindIndexService } from 'src/kms/blind-index.service';

const ADMIN_ROLE_NAME = 'admin';
const ADMIN_PERMISSION_SUBJECT = 'manage';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
    private readonly usersService: UsersService,
    private readonly blindIndexService: BlindIndexService,
  ) {}

  async login(body: LoginDto) {
    const emailBlindIndex = await this.blindIndexService.computeExactIndex(
      body.email,
    );
    const existingUser = await this.userRepository.findOne({
      where: {
        emailBlindIndex,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedException(`Invalid email or password`);
    }

    if (existingUser.active === false) {
      throw new UnauthorizedException(
        `User is inactive. Please contact our Relationship Center.`,
      );
    }

    const validatePassword = await bcrypt.compare(
      body.password,
      existingUser.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException(`Invalid email or password`);
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

  async seedAdminAccess() {
    let permission = await this.permissionsRepository.findOne({
      where: { action: Action.Manage, subject: ADMIN_PERMISSION_SUBJECT },
    });

    if (!permission) {
      permission = await this.permissionsService.createPermissions({
        action: Action.Manage,
        subject: ADMIN_PERMISSION_SUBJECT,
        roleIds: [],
      });
    }

    let role = await this.rolesRepository.findOne({
      where: { role: ADMIN_ROLE_NAME },
      relations: { permissions: true },
    });

    if (!role) {
      role = await this.rolesService.createRole({
        name: ADMIN_ROLE_NAME,
        permissionIds: [permission.id],
      });
    } else if (!role.permissions.some((p) => p.id === permission.id)) {
      role = await this.rolesService.updateRole(role.id, {
        permissionIds: [...role.permissions.map((p) => p.id), permission.id],
      });
    }

    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminPhone = process.env.ADMIN_PHONE;

    if (!adminName || !adminEmail || !adminPassword || !adminPhone) {
      return;
    }

    const existingAdmin = await this.userRepository.findOne({
      where: {
        emailBlindIndex: await this.blindIndexService.computeExactIndex(
          adminEmail,
        ),
      },
    });

    if (!existingAdmin) {
      await this.usersService.signup({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: ADMIN_ROLE_NAME,
      });
    }
  }
}
