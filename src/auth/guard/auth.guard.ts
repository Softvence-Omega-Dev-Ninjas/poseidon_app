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
    const isPublicCatchBlock: { isPublic: boolean | undefined } = {
      isPublic: undefined,
    };
    try {
      const request = context.switchToHttp().getRequest<Request>();

      // 1. Allow if route is public
      const isPublic = this.reflector.get<boolean>(
        IS_PUBLIC_KEY,
        context.getHandler(),
      );
      // 2. Get required roles from metadata
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // If the route is public, we can skip further checks
      isPublicCatchBlock.isPublic = isPublic;
      if (isPublic && !requiredRoles) return true;
      if (!requiredRoles) return false;

      // 3. Validate token and extract user info
      //    Check if user has required roles
      const token = this.extractBearerToken(request);
      if (token === '' && isPublic) {
        request['sub'] = '';
        return true;
      }
      // token checking
      if (token === '') throw new UnauthorizedException();
      const payload = await this.jwtService.verifyAsync<PayloadType>(token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });

      request['sub'] = payload.id;
      request['shop_id'] = payload.shop_id;
      if (isPublic) return true;
      console.log(payload.role, requiredRoles);
      return requiredRoles.some((role) => payload.role?.includes(role));
    } catch {
      if (isPublicCatchBlock.isPublic) return true;
      throw new UnauthorizedException();
    }
  }

  private extractBearerToken(req: Request): string {
    const authHeader: string | undefined = req.headers[
      'authorization'
    ] as string;
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1] ?? '';
    }
    return '';
  }
}
