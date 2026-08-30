import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CaslAbilityFactory } from './casl/ability.factory';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';
import {
  AppAbility,
  CHECK_POLICIES_KEY,
  PolicyHandler,
} from './decorators/check.policies.decorator';
import { Ability } from '@casl/ability';
import { Action } from './models/enums/casl.action';
import { Subjects } from './models/enums/casl.subject';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.can(Action.Manage, 'manage')) {
      return true;
    }

    for (const handler of policyHandlers) {
      const { granted, action, subject } = this.execPolicyHandler(
        handler,
        ability,
      );

      if (!granted) {
        const permission =
          action && subject
            ? `${action}.${subject}`
            : 'required for this action';

        throw new ForbiddenException(
          `You do not have the necessary "${permission}" permission to perform this action. Please ask your administrator to grant this permission to your role.`,
        );
      }
    }

    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    let action: Action | undefined;
    let subject: Subjects | undefined;

    const trackedAbility = new Proxy(ability, {
      get: (target, prop, receiver) => {
        if (prop === 'can') {
          return (
            checkedAction: Action,
            checkedSubject: Subjects,
            ...rest: unknown[]
          ) => {
            action = checkedAction;
            subject = checkedSubject;
            return (target.can as (...args: unknown[]) => boolean)(
              checkedAction,
              checkedSubject,
              ...rest,
            );
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });

    const granted =
      typeof handler === 'function'
        ? handler(trackedAbility)
        : handler.handle(trackedAbility);

    return { granted, action, subject };
  }
}
