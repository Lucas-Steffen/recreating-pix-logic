import { Injectable } from '@nestjs/common';
import { Logs } from './models/entity/logs.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private readonly auditRepository: Repository<Logs>,
  ) {}

  // Full history of one specific record
  async getEntityHistory(entityName: string, entityId: string): Promise<Logs[]> {
    return this.auditRepository.find({
      where: { entityName, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  // Everything a given actor did
  async getActorHistory(actorId: string): Promise<Logs[]> {
    return this.auditRepository.find({
      where: { actorId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  // Everything that happened to an entity type (e.g. all updates on 'users')
  async getEntityTypeHistory(entityName: string): Promise<Logs[]> {
    return this.auditRepository.find({
      where: { entityName },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
