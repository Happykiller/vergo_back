import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  ExecutionContext,
  CanActivate,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { USER_ROLE } from '@presentation/guard/userRole';
import { UserSession } from '@presentation/auth/jwt.strategy';
import { ROLES_KEY } from '@presentation/guard/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(executionContext: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<USER_ROLE[]>(
      ROLES_KEY,
      executionContext.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const gqlExecutionContext = GqlExecutionContext.create(executionContext);
    const userSession: UserSession = gqlExecutionContext.getContext().req.user;
    const result = requiredRoles.some((role) =>
      userSession.role?.includes(role),
    );

    if (!result) {
      throw new UnauthorizedException('User role not allowed for this action');
    }

    return result;
  }
}
