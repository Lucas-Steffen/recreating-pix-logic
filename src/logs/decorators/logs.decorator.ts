import 'reflect-metadata';

export const LOGS_KEY = 'logs:metadata';

export interface LogsOptions {
  entity: string; // display name stored in the log's 'entityName' field, decoupled from the class name
  ignore?: string[]; // property names excluded from the audited payload (e.g. passwords, tokens)
}

export function Auditable(options: LogsOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(LOGS_KEY, options, target);
  };
}
