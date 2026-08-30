import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './models/roles.entity';
import { DataSource, FindOptionsWhere, In, Repository } from 'typeorm';
import { QueryRolesDto } from './models/dtos/query.role.dto';
import { PaginatedResponseDto } from 'src/shared/models/dtos/paginated-response.dto';
import { createRoleDto } from './models/dtos/create.role.dto';
import { Permissions } from 'src/permissions/models/permissions.entity';
import { updateRoleDto } from './models/dtos/update.role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private readonly permissionsRepository: Repository<Permissions>,
    private readonly dataSource: DataSource,
  ) {}

  async getRoles(query: QueryRolesDto) {
    const where: FindOptionsWhere<Roles> = {
      ...(query.role && { role: query.role }),
      ...(query.id && { id: query.role }),
    };

    const [data, total] = await this.rolesRepository.findAndCount({
      where,
      skip: (query.page - 1) * query.size,
      take: query.size,
    });

    return new PaginatedResponseDto(data, total, query.page, query.size);
  }

  async createRole(body: createRoleDto) {
    const role = await this.rolesRepository.save(
      this.rolesRepository.create({ role: body.name }),
    );

    if (body.permissionIds?.length) {
      const permissions = await Promise.all(
        body.permissionIds.map(async (permissionId) => {
          const permission = await this.permissionsRepository.findOne({
            where: {
              id: permissionId,
            },
          });
          if (!permission)
            throw new NotFoundException(
              `Permission with id "${permissionId}" not found`,
            );
          return permission;
        }),
      );

      role.permissions = permissions;
      await this.rolesRepository.save(role);
    }

    return this.rolesRepository.findOne({
      where: {
        id: role.id,
      },
      relations: {
        permissions: true,
      },
    });
  }

  async updateRole(id: string, body: updateRoleDto) {
    return this.dataSource.transaction(async (manager) => {
      const rolesRepository = manager.getRepository(Roles);
      const permissionsRepository = manager.getRepository(Permissions);

      const role = await rolesRepository.findOne({
        where: { id },
        relations: { permissions: true },
      });

      if (!role) {
        throw new NotFoundException(`Role with id "${id}" not found`);
      }

      if (body.name) {
        role.role = body.name;
      }

      if (body.permissionIds) {
        const permissions = await permissionsRepository.find({
          where: { id: In(body.permissionIds) },
        });

        const foundPermissionIds = new Set(
          permissions.map((permission) => permission.id),
        );
        const missingPermissionId = body.permissionIds.find(
          (permissionId) => !foundPermissionIds.has(permissionId),
        );
        if (missingPermissionId) {
          throw new NotFoundException(
            `Permission with id "${missingPermissionId}" not found`,
          );
        }

        role.permissions = permissions;
      }

      await rolesRepository.save(role);

      return rolesRepository.findOne({
        where: { id },
        relations: { permissions: true },
      });
    });
  }

  async deleteRole(id: string) {
    const existingRole = await this.rolesRepository.findOneBy({
      id,
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    existingRole.deletedAt = new Date();

    await this.rolesRepository.save(existingRole);
  }
}
