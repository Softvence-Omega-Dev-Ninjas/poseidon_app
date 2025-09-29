import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Public } from 'src/auth/guard/public.decorator';
// import { AuthUserService } from 'src/main/user/user-auth-info/authUser.service';
import * as passport from 'passport-google-oauth20';
import { GoogleAuthGuard } from './continue.guard';

@Controller()
export class ContinueController {
  // constructor(private readonly authUserService: AuthUserService) {}
  // GOOGLE
  @Public()
  @Get('/auth/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  // async googleAuth(@Query('from') from: string, @Req() req: Request) {
  //   req.session["from"] = from; // if you’re using sessions
  // }

  @Public()
  @Get('/auth/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    const user = req.user;
    if (!user) throw new NotFoundException('Request user not found!');

    // await this.authUserService.createUser(
    //   {
    //     role,
    //     email,
    //     username,
    //     password,
    //     profile: {
    //       ...profile,
    //       image: imageUrl,
    //     },
    //   },
    //   skip: true,
    // );

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
    console.log('full request google: ', req);
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
