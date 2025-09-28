import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Public } from 'src/auth/guard/public.decorator';

@Controller()
export class ContinueController {
  // constructor(private readonly authUserService: AuthUserService) {}
  // GOOGLE
  @Public()
  @Get('/auth/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    return req.user;
  }

  // FACEBOOK
  @Public()
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Public()
  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: Request) {
    return req.user;
  }

  // TWITTER
  @Get('/auth/twitter')
  @UseGuards(AuthGuard('twitter'))
  async twitterAuth(@Req() req: Request) {
    // log the req.user
    console.log(req.user);
    return req.user;
  }

  @Get('/auth/twitter/callback')
  @UseGuards(AuthGuard('twitter'))
  twitterAuthRedirect(@Req() req: Request) {
    return req.user;
  }
}
