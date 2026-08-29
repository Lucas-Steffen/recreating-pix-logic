import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LogsContext } from './models/context/logs.context';

@Injectable()
export class LogsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const store = LogsContext.getStore();

    if (req.user && store) {
      store.actorId = req.user.id;
      store.actorName = req.user.nome ?? req.user.name ?? null;
      // Joins all roles into a single comma-separated string
      // (so no info is lost when the user has more than one role)
      store.actorRole = Array.isArray(req.user.roles)
        ? req.user.roles.map((r: any) => r.role ?? r.name ?? r).join(',')
        : null;
    }

    return next.handle();
  }
}
