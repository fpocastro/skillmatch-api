import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { CurrentUser } from 'src/auth/strategies/types/current-user.type';
import { InsufficientRolePermissionsException } from '../exceptions/roles.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUser;

    if (!roles.includes(user.role)) {
      this.logger.warn(
        `User ${user.id} with role ${user.role} tried to access a resource with insufficient permissions`,
      );

      throw new InsufficientRolePermissionsException(
        'Action not allowed for this role',
      );
    }

    return true;
  }
}
