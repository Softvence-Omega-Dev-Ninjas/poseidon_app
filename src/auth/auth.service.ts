import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authenticationUserDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { PayloadType } from './guard/jwtPayloadType';
import { SellerService } from 'src/utils/stripe/seller.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly stripeSellerService: SellerService,
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
      username: user?.username,
      provider: user?.provider,
      email: user?.email,
      role: user?.role,
      profile: user?.profile,
      shop_id: user?.shop?.id || '',
      memberships_owner_id: user?.memberships_owner?.id || '',
    };
    const access_token = await this.jwtService.signAsync({
      ...payload,
      stripeAccountId: user?.stripeAccountId || '',
    });

    const financial_account_check: { stripe: boolean } = {
      stripe: false,
    };
    if (user?.role == 'supporter' && user.stripeAccountId) {
      const result = await this.stripeSellerService.checkAccountsInfoSystem(
        user.stripeAccountId,
      );
      console.log('varify stripe ', result);
      financial_account_check.stripe = result;
    }

    // return payload;
    return {
      access_token: `Bearer ${access_token}`,
      user: {
        ...payload,
        profile_varify: user?.varify,
        financial_account:
          user?.role == 'user' || user?.role == 'admin'
            ? true
            : financial_account_check.stripe,
      },
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
