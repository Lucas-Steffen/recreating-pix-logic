import { AsyncLocalStorage } from 'async_hooks';

export interface LogsContextData {
  correlationId: string;
  actorId?: string | null;
  actorRole?: string | null;
  actorName?: string | null;
  ipAddress?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  observation?: string;
}

const storage = new AsyncLocalStorage<LogsContextData>();

export const LogsContext = {
  run<T>(data: LogsContextData, fn: () => T): T {
    return storage.run(data, fn);
  },
  getStore(): LogsContextData | undefined {
    return storage.getStore();
  },
  set(data: Partial<LogsContextData>): void {
    const store = storage.getStore();
    if (store) Object.assign(store, data);
  },
};
