import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { authProviders, CreateLoginDto, RefDto } from '../dto/create-or-login';
import { JwtService } from '@nestjs/jwt';
import { AuthHandlerRepository } from './repository';
import { SellerService } from 'src/utils/stripe/seller.service';
import { omit, slugify } from './utils';
import { profileRequiments } from './utils/constants';

@Injectable()
export class AuthHandlerService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: AuthHandlerRepository,
    private readonly stripeSellerService: SellerService,
  ) {}

  async store(input: Partial<CreateLoginDto>, query?: RefDto) {
    // if query has refId then work with ref -> query?.refId
    if (query?.refId) {
      // handle refferel system
      await this.handleRefferel(query.refId);
    }
    // if provider include with our array then
    if (input?.provider && authProviders.includes(input?.provider)) {
      // alternative if email not found then it will generate a username based on their first name and lastname from their email
      if (!input.profile?.name && !input.email) {
        throw new BadRequestException(
          'Profile name or email must needed to creating account',
        );
      }
      const username = input.email
        ? this.generator(input.email, 'email')
        : input.profile
          ? this.generator(input.profile.name || '', 'name')
          : '';

      if (!username.length)
        throw new InternalServerErrorException('Fail to extract username');
      // check this username is already exist or not
      const isUser = await this.repository.findByUsername(username);
      if (!isUser) {
        // if user not found & (make it's provider include with our auth) then create account and send them a token
        const user = await this.repository.createAuthProvider(
          {
            ...input,
            username,
          },
          query?.refId,
        );
        // user created so, now create token and check strip and then return for sending response from controller
        const token = await this.generateToken({
          ...user,
        });
        const isStrip =
          user.role === 'supporter' && user.stripeAccountId
            ? await this.stripeSellerService.checkAccountsInfoSystem(
                user.stripeAccountId,
              )
            : false;

        const userObj = omit(user, ['stripeAccountId']);
        if (!userObj.profile)
          throw new InternalServerErrorException(
            'Something went wrong! Fail to create user profile',
          );
        return {
          access_token: `Bearer ${token}`,
          user: {
            ...userObj,
            profile_varify: user.varify,
            financial_account:
              ['user', 'admin'].includes(user?.role) || isStrip,
            isFirst: !profileRequiments.every(
              (field) => field in userObj.profile!,
            ), // if all is include then return false otherwise return true
          },
        };
      } else {
        // if user found then based on the page ref send them the response
        // user created so, now create token and check strip and then return for sending response from controller
        const token = await this.generateToken({
          ...isUser,
        });
        const isStrip =
          isUser.role === 'supporter' && isUser.stripeAccountId
            ? await this.stripeSellerService.checkAccountsInfoSystem(
                isUser.stripeAccountId,
              )
            : false;

        const userObj = omit(isUser, ['stripeAccountId']);
        return {
          access_token: `Bearer ${token}`,
          user: {
            ...userObj,
            profile_varify: isUser.varify,
            financial_account:
              isUser?.role == 'user' || isUser?.role == 'admin'
                ? true
                : isStrip,
          },
          isFirst: !profileRequiments.every(
            (field) => field in userObj.profile!,
          ), // if all is include then return false otherwise return true
        };
      }
    } else {
      // creatdential login/signup system
      // handle generel creating accocunt or login
      // TODO: call the sarif vaiyer service
      await this.handleCreadential(input, query);
    }
  }
  async handleCreadential(input: Partial<CreateLoginDto>, ref?: RefDto) {
    // credential handle from here...
  }
  async handleRefferel(id: string) {
    // find user with that id (because referral is a user id)
    const user = await this.repository.findById(id);
    if (!user)
      throw new NotFoundException('User not found with that referral ID');

    return user;
  }
  private generator(input: string, type: 'email' | 'name'): string {
    return type === 'email'
      ? input.split('@')[0]
      : type === 'name'
        ? slugify(input, '-')
        : '';
  }

  private async generateToken<P extends object>(payload: P): Promise<string> {
    return this.jwtService.signAsync({ ...payload });
  }
}
