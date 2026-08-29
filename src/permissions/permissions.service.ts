import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './models/permissions.entity';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Roles } from 'src/roles/models/roles.entity';
import { createPermissionsDto } from './models/dtos/create.permissions.dto';
import { QueryPermissionsDto } from './models/dtos/query.permissions.dto';
import { PaginatedResponseDto } from 'src/shared/models/dtos/paginated-response.dto';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permissions)
        private readonly permissionsRepository: Repository<Permissions>,
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>,
        private readonly dataSource: DataSource
    ) { }

    private normalizeString(str: string): string {
        return str.trim().normalize('NFD')
    }

    async createPermissions(body: createPermissionsDto) {
        const normalizedSubject = this.normalizeString(body.subject)

        const existing = await this.permissionsRepository.findOne({
            where: {
                action: body.action,
                subject: normalizedSubject
            }
        })

        if (existing) {
            throw new ConflictException(
                `Permission ${body.action} on ${normalizedSubject} already exists`
            )
        }

        const permission = await this.permissionsRepository.save(
            this.permissionsRepository.create({
                action: body.action,
                subject: normalizedSubject,
            })
        );

        if (body.roleIds?.length) {
            const roles = await Promise.all(
                body.roleIds.map(async (roleId) => {
                    const role = await this.rolesRepository.findOne({
                        where: { id: roleId },
                        relations: { permissions: true },
                    });

                    if (!role) {
                        throw new NotFoundException(`Role ${roleId} not found`);
                    }

                    return role;
                })
            );

            for (const role of roles) {
                role.permissions.push(permission);
            }

            await this.rolesRepository.save(roles);
        }

        return permission;
    }

    async getPermissions(query: QueryPermissionsDto) {
        const where: FindOptionsWhere<Permissions> = {
            ...(query.action && { action: query.action }),
            ...(query.subject && { subject: ILike(`%${this.normalizeString(query.subject)}%`) }),
        }

        const [data, total] = await this.permissionsRepository.findAndCount({
            where,
            skip: (query.page - 1) * query.size,
            take: query.size,
        })

        return new PaginatedResponseDto(data, total, query.page, query.size)
    }
}
