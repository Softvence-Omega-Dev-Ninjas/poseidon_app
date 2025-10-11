import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

export interface RequestWithUser extends Request {}
// export interface UserTokenPayload {
//   email: string;
//   [key: string]: unknown;
// }

export const COOKIE_KEY = 'accessToken';
export function cookieHandler(
  ctx: RequestWithUser,
  mode: 'get',
  token?: string,
): any;
export function cookieHandler(
  ctx: Response,
  mode: 'set' | 'clear',
  token?: string,
  options?: CookieOptions,
): void;

export function cookieHandler(
  ctx: RequestWithUser | Response,
  mode: 'set' | 'get' | 'clear',
  token?: string,
  options: CookieOptions = {},
) {
  const defaultOptions: CookieOptions = {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 90days
    httpOnly: true,
    secure: process.env.ENV_MODE === 'production',
    sameSite: 'lax',
  };
  const margedOptions = { ...defaultOptions, ...options };

  switch (mode) {
    case 'set': {
      if (!token) throw new NotFoundException('Generated token not found!');
      (ctx as Response).cookie(COOKIE_KEY, token, margedOptions);
      break;
    }
    case 'clear':
      (ctx as Response).clearCookie(COOKIE_KEY, margedOptions);
      break;
    case 'get': {
      const cookie =
        (ctx as Request).cookies ||
        ((ctx as Request).headers['cookie'] as string) ||
        (ctx as Request).headers.authorization;
      if (!cookie)
        throw new UnauthorizedException("Unauthorized user, can't find token");
      return cookie.split(`${COOKIE_KEY}=`)[1] || cookie.split('Bearer ')[1];
    }
    default:
      throw new NotFoundException('Invalid mode for cookieHandler');
  }
}
