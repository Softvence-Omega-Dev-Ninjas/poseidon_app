import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authenticationUserDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { PayloadType } from './guard/jwtPayloadType';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async userCredentialsAuthentication(
    user: authenticationUserDto | null,
    passwordDto: string,
  ) {
    const userpassword = user && user.password ? user.password : '';
    const isPasswordValid = await argon2.verify(userpassword, passwordDto);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          message: 'Incorrect credentials. Please try again.',
          redirect_url: null,
          error: 'UNAUTHORIZED',
          data: null,
          success: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = {
      id: user?.id,
      provider: user?.provider,
      email: user?.email,
      role: user?.role,
      profile: user?.profile,
      shop_id: user?.shop?.id || '',
      memberships_owner_id: user?.memberships_owner?.id || '',
      stripeAccountId: user?.stripeAccountId || '',
    };
    const access_token = await this.jwtService.signAsync({
      ...payload,
    });

    // return payload;
    return {
      access_token: `Bearer ${access_token}`,
      user: payload,
    };
  }

  async checkJwt(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<PayloadType>(token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });
      return payload;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          message: 'Incorrect credentials. Please try again.',
          redirect_url: null,
          error: 'UNAUTHORIZED',
          data: null,
          success: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
