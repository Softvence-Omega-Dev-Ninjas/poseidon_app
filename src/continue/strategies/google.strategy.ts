import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: <U = any>(error: any, user?: U) => void,
  ) {
    console.log('Google Profile:', profile);
    console.log('Google Token:', accessToken);
    console.log('Google Refresh Token:', refreshToken);
    console.log('Twitter Profile:', profile);
    return done(null, 'hello');
  }
}
