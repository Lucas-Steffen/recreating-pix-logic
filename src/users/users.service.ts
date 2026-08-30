import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Users } from './models/user.entity';
import { UserSearchToken } from './models/user-search-token.entity';
import { createUserDto } from './models/dtos/create.user.dto';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { Roles } from 'src/roles/models/roles.entity';
import { KmsService } from 'src/kms/kms.service';
import { BlindIndexService } from 'src/kms/blind-index.service';
import { tokenizeName } from 'src/shared/utils/normalize.util';
import { searchUsersDto } from './models/dtos/search.users.dto';
import { PaginatedResponseDto } from 'src/shared/models/dtos/paginated-response.dto';

const POSTGRES_UNIQUE_VIOLATION = '23505';

interface UserPii {
  name: string;
  email: string;
  phone: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(UserSearchToken)
    private readonly userSearchTokenRepository: Repository<UserSearchToken>,
    private readonly dataSource: DataSource,
    private readonly kmsService: KmsService,
    private readonly blindIndexService: BlindIndexService,
  ) {}

  async signup(body: createUserDto) {
    const emailBlindIndex = await this.blindIndexService.computeExactIndex(
      body.email,
    );

    const existingUser = await this.userRepository.findOne({
      where: { emailBlindIndex },
    });

    if (existingUser) {
      throw new ConflictException(`Email "${body.email}" already exists`);
    }

    const role = await this.rolesRepository.findOne({
      where: {
        role: body.role,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role "${body.role}" not found`);
    }

    const { plaintextKey, encryptedKey } =
      await this.kmsService.generateDataKey();

    const piiCiphertext = this.kmsService.encryptPayload(
      { name: body.name, email: body.email, phone: body.phone },
      plaintextKey,
    );

    const [phoneBlindIndex, tokenHashes] = await Promise.all([
      this.blindIndexService.computeExactIndex(body.phone),
      this.blindIndexService.computeTokenIndexes(body.name),
    ]);

    const newUser = new Users();
    newUser.piiCiphertext = piiCiphertext;
    newUser.dataKeyCiphertext = encryptedKey.toString('base64');
    newUser.emailBlindIndex = emailBlindIndex;
    newUser.phoneBlindIndex = phoneBlindIndex;
    newUser.password = await bcrypt.hash(
      body.password,
      +process.env.BCRYPT_SALT!,
    );
    newUser.roles = [role];

    try {
      await this.dataSource.transaction(async (manager) => {
        await manager.save(newUser);
        const tokens = tokenHashes.map((tokenHash) =>
          manager.create(UserSearchToken, { userId: newUser.id, tokenHash }),
        );
        await manager.save(tokens);
      });
    } catch (error) {
      if (this.isUniqueEmailViolation(error)) {
        throw new ConflictException(`Email "${body.email}" already exists`);
      }
      throw error;
    }

    return {
      id: newUser.id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      active: newUser.active,
    };
  }

  private isUniqueEmailViolation(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string })?.code ===
        POSTGRES_UNIQUE_VIOLATION
    );
  }

  async findByIdWithRolesAndPermissions(id: string) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
  }

  async searchUsers(query: searchUsersDto) {
    if (!query.name && !query.email && !query.phone) {
      throw new BadRequestException(
        'Provide at least one of "name", "email" or "phone" to search',
      );
    }

    let matchedIds: Set<string> | null = null;
    const intersect = (ids: string[]) => {
      matchedIds =
        matchedIds === null
          ? new Set(ids)
          : new Set(ids.filter((id) => matchedIds!.has(id)));
    };

    if (query.name) {
      const tokens = tokenizeName(query.name);
      const tokenHashes = await Promise.all(
        tokens.map((token) => this.kmsService.generateMac(token)),
      );

      const matches = await this.userSearchTokenRepository
        .createQueryBuilder('token')
        .select('token.userId', 'userId')
        .where('token.tokenHash IN (:...tokenHashes)', { tokenHashes })
        .groupBy('token.userId')
        .having('COUNT(DISTINCT token.tokenHash) = :count', {
          count: tokenHashes.length,
        })
        .getRawMany<{ userId: string }>();

      intersect(matches.map((match) => match.userId));
    }

    if (query.email) {
      const emailBlindIndex = await this.blindIndexService.computeExactIndex(
        query.email,
      );
      const users = await this.userRepository.find({
        where: { emailBlindIndex },
      });
      intersect(users.map((user) => user.id));
    }

    if (query.phone) {
      const phoneBlindIndex = await this.blindIndexService.computeExactIndex(
        query.phone,
      );
      const users = await this.userRepository.find({
        where: { phoneBlindIndex },
      });
      intersect(users.map((user) => user.id));
    }

    const allIds = Array.from(matchedIds ?? []);
    const total = allIds.length;
    const start = (query.page - 1) * query.size;
    const pageUserIds = allIds.slice(start, start + query.size);

    const users = pageUserIds.length
      ? await this.userRepository.find({
          where: pageUserIds.map((id) => ({ id })),
        })
      : [];

    const data = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        active: user.active,
        ...(await this.decryptPii(user)),
      })),
    );

    return new PaginatedResponseDto(data, total, query.page, query.size);
  }

  private async decryptPii(user: Users): Promise<UserPii> {
    const dataKey = await this.kmsService.decryptDataKey(
      Buffer.from(user.dataKeyCiphertext, 'base64'),
    );
    return this.kmsService.decryptPayload(
      user.piiCiphertext,
      dataKey,
    ) as unknown as UserPii;
  }
}
