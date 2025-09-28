import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
  constructor() {
    super({
      consumerKey: process.env.TWITTER_CLIENT_ID!,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET!,
      callbackURL: process.env.TWITTER_CALLBACK_URL!,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    console.log('Twitter Profile:', profile);
    const user = {
      provider: 'twitter',
    };
    done(null, user);
  }
}
