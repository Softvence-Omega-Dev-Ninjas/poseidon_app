import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard(new Reflector(), new JwtService({}), new ConfigService())).toBeDefined();
  });
});
