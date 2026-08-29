import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditLogger } from './audit-logger';
import { LogsAction } from './enums/logs.action.enum';

@Injectable()
@EventSubscriber()
export class LogsSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  async afterInsert(event: InsertEvent<any>): Promise<void> {
    const meta = AuditLogger.getMeta(event.entity);
    if (!meta) return;

    await AuditLogger.write(event.manager, {
      action: LogsAction.CREATE,
      entityName: meta.entity,
      entityId: event.entity.id,
      previousState: null,
      newState: AuditLogger.sanitize(event.entity, meta.ignore),
      changedFields: null,
    });
  }

  async afterUpdate(event: UpdateEvent<any>): Promise<void> {
    if (!event.entity) return;
    const meta = AuditLogger.getMeta(event.entity);
    if (!meta) return;

    const previous = AuditLogger.sanitize(event.databaseEntity, meta.ignore);
    const current = AuditLogger.sanitize(event.entity, meta.ignore);
    const diff = AuditLogger.calculateDiff(previous, current);

    if (Object.keys(diff).length === 0) return; // nothing actually changed

    await AuditLogger.write(event.manager, {
      action: LogsAction.UPDATE,
      entityName: meta.entity,
      entityId: (event.entity as any).id,
      previousState: previous,
      newState: current,
      changedFields: diff,
    });
  }

  async afterRemove(event: RemoveEvent<any>): Promise<void> {
    if (!event.entity) return;
    const meta = AuditLogger.getMeta(event.entity);
    if (!meta) return;

    await AuditLogger.write(event.manager, {
      action: LogsAction.DELETE,
      entityName: meta.entity,
      entityId: (event.entityId as string) ?? (event.entity as any).id,
      previousState: AuditLogger.sanitize(event.entity, meta.ignore),
      newState: null,
      changedFields: null,
    });
  }

  async afterSoftRemove(event: SoftRemoveEvent<any>): Promise<void> {
    if (!event.entity) return;
    const meta = AuditLogger.getMeta(event.entity);
    if (!meta) return;

    await AuditLogger.write(event.manager, {
      action: LogsAction.SOFT_DELETE,
      entityName: meta.entity,
      entityId: (event.entity as any).id,
      previousState: AuditLogger.sanitize(event.entity, meta.ignore),
      newState: null,
      changedFields: null,
    });
  }
}
