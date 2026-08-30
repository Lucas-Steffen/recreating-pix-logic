import { Injectable, NestMiddleware } from '@nestjs/common';
import { LogsContext } from './models/context/logs.context';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      (req.headers['x-correlation-id'] as string) ?? randomUUID();

    res.setHeader('x-correlation-id', correlationId);

    LogsContext.run(
      {
        correlationId,
        actorId: null,
        actorRole: null,
        actorName: null,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        method: req.method,
        path: req.originalUrl,
      },
      () => next(),
    );
  }
}
