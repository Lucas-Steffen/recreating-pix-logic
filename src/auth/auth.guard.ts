import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { LogsContext } from 'src/logs/models/context/logs.context';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly userService: UsersService
  ) { }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });

      const user = await this.userService.findByIdWithRolesAndPermissions(
        payload.sub,
      );

      if (!user || user.deletedAt) {
        throw new UnauthorizedException();
      }

      req["user"] = user;
      context.switchToHttp().getResponse().locals.userId = user?.id;

      LogsContext.set({
        actorId: user.id,
        actorRole: user.roles?.map((r) => r.role).join(",") ?? null,
      });
    } catch (err) {
      console.error('[AuthGuard] error:', err instanceof Error ? err.message : err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}