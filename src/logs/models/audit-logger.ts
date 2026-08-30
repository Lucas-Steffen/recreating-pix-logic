import { EntityManager } from 'typeorm';
import { LogsContext } from './context/logs.context';
import { Logs } from './entity/logs.entity';
import { LogsAction } from './enums/logs.action.enum';
import { LOGS_KEY, LogsOptions } from '../decorators/logs.decorator';

const DEFAULT_IGNORED_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'];

export type StateDiff = Record<string, { from: any; to: any }>;

export interface AuditEntry {
  action: LogsAction;
  entityName: string;
  entityId: string;
  previousState: Record<string, any> | null;
  newState: Record<string, any> | null;
  changedFields: StateDiff | null;
}

// Sanitizing/diffing/writing logic used by LogsSubscriber, kept separate so the subscriber only orchestrates.
export const AuditLogger = {
  getMeta(target: any): LogsOptions | undefined {
    if (!target) return undefined;
    const ctor = typeof target === 'function' ? target : target.constructor;
    return Reflect.getMetadata(LOGS_KEY, ctor);
  },

  sanitize(entity: any, ignore: string[] = []): Record<string, any> {
    if (!entity) return {};
    const ignored = [...DEFAULT_IGNORED_FIELDS, ...ignore];
    const result: Record<string, any> = {};
    for (const key of Object.keys(entity)) {
      if (ignored.includes(key)) continue;
      const value = entity[key];
      if (value === undefined) continue;
      // Collapse loaded relations (single or to-many) to their ID so the snapshot doesn't inflate
      if (Array.isArray(value)) {
        // Sorted so the diff isn't sensitive to the arbitrary row order Postgres
        // returns for the "before" (RelationIdLoader) vs "after" (repository.find) queries.
        result[key] = value
          .map((item) =>
            item && typeof item === 'object' && 'id' in item ? { id: item.id } : item,
          )
          .sort((a, b) => {
            const aKey = String(a && typeof a === 'object' ? a.id : a);
            const bKey = String(b && typeof b === 'object' ? b.id : b);
            return aKey.localeCompare(bKey);
          });
      } else if (value && typeof value === 'object' && 'id' in value) {
        result[key] = { id: value.id };
      } else {
        result[key] = value;
      }
    }
    return result;
  },

  calculateDiff(previous: Record<string, any>, current: Record<string, any>): StateDiff {
    const diff: StateDiff = {};
    const keys = new Set([...Object.keys(previous ?? {}), ...Object.keys(current ?? {})]);

    for (const key of keys) {
      const from = previous?.[key];
      const to = current?.[key];
      if (JSON.stringify(from) !== JSON.stringify(to)) {
        diff[key] = { from, to };
      }
    }
    return diff;
  },

  async write(manager: EntityManager, entry: AuditEntry): Promise<void> {
    const ctx = LogsContext.getStore();

    const log = manager.create(Logs, {
      ...entry,
      correlationId: ctx?.correlationId ?? null,
      actorId: ctx?.actorId ?? null,
      actorRole: ctx?.actorRole ?? null,
      actorName: ctx?.actorName ?? null,
      ipAddress: ctx?.ipAddress ?? null,
      userAgent: ctx?.userAgent ?? null,
      httpMethod: ctx?.method ?? null,
      httpPath: ctx?.path ?? null,
      observation: ctx?.observation ?? null,
    });

    await manager.save(Logs, log);
  },
};
