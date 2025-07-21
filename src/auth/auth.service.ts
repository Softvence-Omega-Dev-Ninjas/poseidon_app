import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authenticationUserDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

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
      provider: user?.provider,
      email: user?.email,
      role: user?.role,
      profile: user?.profile,
    };
    const access_token = await this.jwtService.signAsync({
      sub: user?.id,
      ...payload,
    });

    return {
      access_token: `Bearer ${access_token}`,
      user: payload,
    };
  }
}
