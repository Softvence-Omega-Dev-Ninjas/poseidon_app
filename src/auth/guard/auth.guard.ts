import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PayloadType } from './jwtPayloadType';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();

      // 1. Allow if route is public
      const isPublic = this.reflector.get<boolean>(
        IS_PUBLIC_KEY,
        context.getHandler(),
      );
      if (isPublic) return true;

      // 2. Get required roles from metadata
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) return false;

      // 3. Validate token and extract user info
      //    Check if user has required roles
      const token = this.extractBearerToken(request);
      
      if (token === '') throw new UnauthorizedException();
      const payload = await this.jwtService.verifyAsync<PayloadType>(token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });
      if (!payload) {
        throw new UnauthorizedException();
      }
      request['sub'] = payload.id;
      return requiredRoles.some((role) => payload.role?.includes(role));
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractBearerToken(req: Request): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authHeader = req.headers['authorization'];
    
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1] ?? '';
    }
    return '';
  }
}
