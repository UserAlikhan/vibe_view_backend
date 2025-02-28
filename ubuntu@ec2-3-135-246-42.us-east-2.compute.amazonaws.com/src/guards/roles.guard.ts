import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/constants/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { UsersService } from 'src/users/users.service';

type UserRole = 'ADMIN' | 'USER'

function matchRoles(requiredRoles: string[], userRole: UserRole): boolean {
  return requiredRoles.some(role => role == userRole);
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    let payload = null

    const requiredRoles = this.reflector.get(Roles, context.getHandler());

    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userToken = this.extractTokenFromHeader(request);

    try {
      payload = await this.jwtService.verifyAsync(userToken, {
        secret: jwtConstants.secret
      })
    } catch (error) {
      throw new UnauthorizedException()
    }

    const userRole = await this.usersService.findUsersRole(payload?.email)

    if (!userRole || !requiredRoles) {
      throw new ForbiddenException('User roles are not defined');
    }

    const hasPermission = matchRoles(requiredRoles, userRole)

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
