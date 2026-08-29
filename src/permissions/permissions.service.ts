import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissions } from './models/permissions.entity';
import { DataSource, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';
import { Roles } from 'src/roles/models/roles.entity';
import { createPermissionsDto } from './models/dtos/create.permissions.dto';
import { QueryPermissionsDto } from './models/dtos/query.permissions.dto';
import { PaginatedResponseDto } from 'src/shared/models/dtos/paginated-response.dto';
import { updatePermissionDto } from './models/dtos/update.permissions.dto';

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

    async updatePermission(id: string, body: updatePermissionDto) {
        return this.dataSource.transaction(async (manager) => {
            const permissionsRepository = manager.getRepository(Permissions);
            const rolesRepository = manager.getRepository(Roles);

            const permission = await permissionsRepository.findOne({
                where: { id },
                relations: { roles: true },
            });

            if (!permission) {
                throw new NotFoundException(`Permission ${id} not found`);
            }

            const action = body.action ?? permission.action;
            const subject = body.subject ? this.normalizeString(body.subject) : permission.subject;

            if (body.action || body.subject) {
                const existing = await permissionsRepository.findOne({
                    where: { action, subject, id: Not(id) },
                });

                if (existing) {
                    throw new ConflictException(
                        `Permission ${action} on ${subject} already exists`
                    );
                }
            }

            permission.action = action;
            permission.subject = subject;
            await permissionsRepository.save(permission);

            if (body.roleIds) {
                const currentRoleIds = permission.roles.map((role) => role.id);
                const roleIds = Array.from(new Set([...currentRoleIds, ...body.roleIds]));

                const roles = await rolesRepository.find({
                    where: { id: In(roleIds) },
                    relations: { permissions: true },
                });

                const foundRoleIds = new Set(roles.map((role) => role.id));
                const missingRoleId = body.roleIds.find((roleId) => !foundRoleIds.has(roleId));
                if (missingRoleId) {
                    throw new NotFoundException(`Role ${missingRoleId} not found`);
                }

                for (const role of roles) {
                    role.permissions = body.roleIds.includes(role.id)
                        ? [...role.permissions.filter((p) => p.id !== permission.id), permission]
                        : role.permissions.filter((p) => p.id !== permission.id);
                }

                await rolesRepository.save(roles);
            }

            return permissionsRepository.findOne({
                where: { id },
                relations: { roles: true },
            });
        });
    }

    async deletePermission(id: string){
        const existingPermission = await this.permissionsRepository.findOneOrFail({
            where: {
                id
            }
        })

        if(!existingPermission){
            throw new NotFoundException(`Permission ${id} not found`)
        }

        existingPermission.deletedAt = new Date()

        await this.permissionsRepository.save(existingPermission)
    }
}
