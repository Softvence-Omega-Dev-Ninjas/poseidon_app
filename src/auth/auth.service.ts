import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authenticationUserDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { PayloadType } from './guard/jwtPayloadType';
import { SellerService } from 'src/utils/stripe/seller.service';
import {
  VarifyEmailDto,
  ForgetPasswordToken,
  ForgetPasswordCodeCheck,
  CheckVarifyEmail,
  CheckVarifyEmailAfterLogin,
} from './dto/varify.dto';
import { generateCode } from 'src/common/utils/generateCode';
import { MailService } from 'src/utils/mail/mail.service';
import { AuthUserService } from 'src/main/user/user-auth-info/authUser.service';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly stripeSellerService: SellerService,
    private readonly mailService: MailService,
    private readonly authUserService: AuthUserService,
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
      varify: user?.varify,
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
      // console.log('varify stripe ', result);
      financial_account_check.stripe = result;
    }

    // return payload;
    return {
      access_token: `Bearer ${access_token}`,
      user: {
        ...payload,
        // profile_varify: user?.varify,
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
      // console.log(err);
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

  // signup varify email

  async varifyemail(data: VarifyEmailDto) {
    const G4code = generateCode();
    // console.log('G4code', G4code);
    const token = await this.jwtService.signAsync(
      { email: data.email, code: G4code },
      {
        secret: this.configService.get<string>('AUTHSECRET'),
        expiresIn: '2m',
      },
    );
    const subject = 'Email Verification';
    const message = `Your verification code is: ${G4code}`;

    const resData = await this.mailService.sendEmail(
      data.email,
      subject,
      message,
    );

    console.log('email resData', resData);
    // console.log('email resData', resData.response.includes('OK'));

    if (!resData.response.includes('250 2.0.0')) {
      throw new HttpException(
        {
          message: 'Email not sent',
          error: 'BAD_REQUEST',
          data: null,
          success: false,
          next_page: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'Email sent successfully',
      error: null,
      data: { sendCode: resData.messageId, token },
      success: true,
      next_page: true,
    };
  }

  async checkVarifyEmail(data: CheckVarifyEmail) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        email: string;
        code: number;
      }>(data.token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });
      if (payload.code != data.code) {
        return {
          message: 'Incorrect OTP. Please try again.',
          data: null,
          success: false,
        };
      }
      return {
        message: 'Email verified successfully',
        data: 'Email verified successfully',
        success: true,
        next_page: true,
      };
    } catch (err) {
      // console.log(err);
      throw new HttpException(
        {
          message: 'Incorrect OTP. Please try again.',
          data: null,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkVarifyEmailAfterLogin(data: CheckVarifyEmailAfterLogin) {
    if (!data.username || !data.email)
      return cResponseData({
        message: 'Username is required',
        data: null,
        success: false,
        error: 'BAD_REQUEST',
        next_page: false,
      });
    try {
      const payload = await this.jwtService.verifyAsync<{
        email: string;
        code: number;
      }>(data.token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });
      if (payload.code != Number(data.code)) {
        return {
          message: 'Incorrect OTP. Please try again.',
          data: null,
          success: false,
        };
      }
      const checkVarify =
        await this.authUserService.afterLoginVarifyAccountSystem(
          data.username,
          data.email,
        );
      if (!checkVarify)
        return cResponseData({
          message: 'Account not found',
          data: null,
          success: false,
          error: 'BAD_REQUEST',
          next_page: false,
        });
      return {
        message: 'Email verified successfully',
        data: 'Email verified successfully',
        success: true,
        varify: checkVarify,
        next_page: true,
      };
    } catch (err) {
      // console.log(err);
      throw new HttpException(
        {
          message: 'Incorrect OTP. Please try again.',
          data: null,
          success: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // forgetpassword system send email
  async forgetPasswordGenaredCode(data: VarifyEmailDto) {
    const userinfo = await this.authUserService.getUserInfo(data.email);
    if (!userinfo || !userinfo.id) {
      throw new HttpException(
        {
          message: 'User not found',
          error: 'BAD_REQUEST',
          data: null,
          success: false,
          next_page: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const G4code = generateCode();
    const token = await this.jwtService.signAsync(
      { userid: userinfo.id, email: userinfo.email, code: G4code },
      {
        secret: this.configService.get<string>('AUTHSECRET'),
        expiresIn: '5m',
      },
    );
    const subject = 'Forget Password';
    const message = `Your verification code is: ${G4code} </br>
    or </br>
    <a href="${process.env.FRONTEND_URL}/forget-password?token=${token}">Click here to reset your password</a>
    `;
    const resData = await this.mailService.sendEmail(
      data.email,
      subject,
      message,
    );

    console.log('forget pass ', resData);

    if (!resData.response.includes('250 2.0.0')) {
      throw new HttpException(
        {
          message: 'Email not sent',
          error: 'BAD_REQUEST',
          data: null,
          success: false,
          next_page: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      message: 'Email sent successfully',
      error: null,
      data: { sendCode: resData.messageId, token },
      redirect_url: `${process.env.FRONTEND_URL}/forget-password?token=${token}`,
      success: true,
      next_page: true,
    };
  }

  async checkForgetPasswordCode(data: ForgetPasswordCodeCheck) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        userid: string;
        email: string;
        code: number;
      }>(data.token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });
      if (payload.code != data.code) {
        return {
          message: 'Incorrect OTP. Please try again.',
          data: null,
          success: false,
        };
      }
      const userinfo = await this.authUserService.getUserInfo(payload.email);
      if (!userinfo || !userinfo.id) {
        return {
          message: 'Incorrect OTP. Please try again.',
          data: null,
          success: false,
        };
      }
      const token = await this.jwtService.signAsync(
        { user: userinfo },
        {
          secret: this.configService.get<string>('AUTHSECRET'),
          expiresIn: '5m',
        },
      );
      return {
        message: 'Email verified successfully',
        error: null,
        data: { chnagePasswordAccessCode: token },
        chnagePasswordAccess: true,
        success: true,
        next_page: true,
      };
    } catch {
      return {
        message: 'Incorrect OTP. Please try again.',
        data: null,
        success: false,
      };
    }
  }

  async changePassword(data: ForgetPasswordToken) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        user: {
          id: string;
          email: string;
          deactivate: boolean;
          role: string;
          varify: boolean;
        };
        code: number;
      }>(data.token, {
        secret: this.configService.get<string>('AUTHSECRET'),
      });

      const newPass = await this.authUserService.updatePassword(
        payload.user.id,
        data.newPassword,
      );
      return {
        message: 'Password changed successfully',
        error: null,
        data: newPass.username,
        success: true,
      };
    } catch (err) {
      // console.log(err);
      throw new HttpException(
        {
          message: ' Response time out ',
          data: null,
          success: false,
          redirect_url: 'forget-password',
          next_page: false,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
