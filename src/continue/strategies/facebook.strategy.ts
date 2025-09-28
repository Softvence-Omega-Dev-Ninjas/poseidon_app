import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: <U = any>(error: any, user?: U) => void,
  ) {
    console.log(profile);
    return done(null, profile);
  }
}
