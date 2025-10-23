import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import {
  authenticationUserDto,
  CredentialsSignInInfo,
} from 'src/auth/dto/create-auth.dto';
import * as argon2 from 'argon2';
import { SellerService } from 'src/utils/stripe/seller.service';
import { cResponseData } from 'src/common/utils/common-responseData';
import { JwtService } from '@nestjs/jwt';
// import { v4 as uuidv4 } from 'uuid';
// import { UserInfoType } from './response.type';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: SellerService,
    private readonly jwtService: JwtService,
    private readonly stripeSellerService: SellerService,
  ) {}

  // chack user db isExestUser - yes or not
  async isExestUser(email: string) {
    const result = await this.prisma.user.findFirst({
      where: {
        email: email,
        deactivate: false,
      },
      select: {
        id: true,
        email: true,
        deactivate: true,
      },
    });
    return !!result;
  }

  //get user info
  async getUserInfo(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: email,
        deactivate: false,
      },
      select: {
        id: true,
        email: true,
        deactivate: true,
        role: true,
        varify: true,
      },
    });
  }

  async varifyUser(id: string) {
    return await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        varify: true,
      },
    });
  }

  // chnages password update
  async updatePassword(id: string, password: string) {
    const hashedPassword = await argon2.hash(password);
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  // credentials register system
  async createUser(createUserDto: CreateUserDto, skip: boolean) {
    // const { skip, ...createUserDto } = data;
    // // console.log('createUserDto ========++++++++000000', createUserDto);
    const userIsExest = await this.isExestUser(createUserDto.email);
    if (userIsExest) {
      throw new HttpException(
        {
          message: 'Your have already registered please login',
          redirect_url: `${process.env.FRONTEND_URL}/login`,
          error: null,
          data: null,
          success: false,
        },
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await argon2.hash(createUserDto.password);

    // create new supporter
    if (createUserDto.role === 'supporter') {
      return await this.createSupporterAccount(
        {
          ...createUserDto,
          password: hashedPassword,
        },
        skip,
      );
    }
    // create new user
    // create a hash password
    // create a user ref system
    let refData = {};
    if (createUserDto.referralId) {
      refData = {
        invited: {
          create: {
            inviterId: createUserDto.referralId,
          },
        },
      };
    }

    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        role: createUserDto.role as 'user',
        varify: true,
        profile: {
          create: {
            ...createUserDto.profile,
          },
        },
        ...refData,
      },
      select: {
        id: true,
        email: true,
        provider: true,
        username: true,
        role: true,
        varify: true,
        profile: {
          select: {
            name: true,
            image: true,
          },
        },
        shop: { select: { id: true } },
        memberships_owner: { select: { id: true } },
      },
    });

    const jwtCreateUserData =
      await this.userCredentialsAuthenticationWithSignUp(newUser);

    return {
      message: 'Your Have SignUp Successful',
      redirect_url: `${process.env.FRONTEND_URL}/login`,
      error: null,
      payload: jwtCreateUserData,
      success: true,
    };
  }

  // credentials login system

  async loginUser(loginUserDto: CredentialsSignInInfo) {
    const userIsExest = await this.isExestUser(loginUserDto.email);
    if (!userIsExest) {
      throw new HttpException(
        {
          message:
            'You don’t have an account. Please register first to continue.',
          redirect_url: 'http://localhost:3000/signup',
          error: null,
          data: null,
          success: false,
        },
        HttpStatus.CONFLICT,
      );
    }
    return await this.prisma.user.findFirst({
      where: {
        AND: [{ email: loginUserDto.email }, { deactivate: false }],
      },
      select: {
        id: true,
        provider: true,
        username: true,
        email: true,
        password: true,
        role: true,
        varify: true,
        stripeAccountId: true,
        profile: {
          select: {
            name: true,
            image: true,
          },
        },
        shop: {
          select: {
            id: true,
          },
        },
        memberships_owner: {
          select: { id: true },
        },
      },
    });
  }

  // create supporter account
  private async createSupporterAccount(
    createUserDto: CreateUserDto,
    skip: boolean,
  ) {
    // console.log('createUserDto =====++++++', createUserDto);
    try {
      // If the user is a supporter, create a support_cart_layout
      // console.log('createSupporterAccount......');
      // return { ...createUserDto, skip };

      // create a user ref system
      let refData = {};
      if (createUserDto.referralId) {
        refData = {
          invited: {
            create: {
              inviterId: createUserDto.referralId,
            },
          },
        };
      }

      const newSupporter = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          password: createUserDto.password,
          role: createUserDto.role as 'supporter',
          varify: true,
          profile: {
            create: {
              ...createUserDto.profile,
            },
          },
          ...refData,
          support_cart_layout: {
            create: {},
          },
          shop: {
            create: {},
          },
          memberships_owner: {
            create: {},
          },
        },
        select: {
          id: true,
          email: true,
          provider: true,
          username: true,
          role: true,
          varify: true,
          profile: {
            select: {
              name: true,
              image: true,
              address: true,
              city: true,
              country: true,
              postcode: true,
              state: true,
              description: true,
            },
          },
          support_cart_layout: {
            select: {
              id: true,
            },
          },
          shop: {
            select: {
              id: true,
            },
          },
          memberships_owner: {
            select: {
              id: true,
            },
          },
          stripeAccountId: true,
        },
      });

      if (
        newSupporter.support_cart_layout &&
        newSupporter.support_cart_layout.id
      ) {
        await this.prisma.supportCart_default_price.create({
          data: {
            support_cart_layout_id: newSupporter.support_cart_layout.id,
            name: 'one Short Drink - lili',
            price: 5,
          },
        });
      }

      if (skip) {
        const jwtData = await this.userCredentialsAuthenticationWithSignUp({
          id: newSupporter.id,
          provider: newSupporter.provider,
          username: newSupporter.username,
          email: newSupporter.email,
          role: newSupporter.role,
          profile:
            newSupporter.profile && newSupporter.profile.name
              ? {
                  name: newSupporter.profile.name,
                  image: newSupporter.profile.image,
                }
              : null,
          shop: newSupporter.shop,
          memberships_owner: newSupporter.memberships_owner,
          stripeAccountId: newSupporter.stripeAccountId,
          varify: newSupporter.varify,
        });

        return {
          message: 'Supporter account created successfully',
          redirect_url: `${process.env.FRONTEND_URL}/login`,
          error: null,
          payload: jwtData,
          success: true,
        };
      }

      // // create stripe connected account for supporter
      const createAccountStripe = await this.stripe.createConnectedAccount({
        id: newSupporter.id,
        email: newSupporter.email,
        url: `viewpage/${newSupporter.username}`, // ${process.env.FRONTEND_URL}/
        createProfileDto: {
          name: newSupporter.profile?.name as string,
          username: newSupporter.username,
          address: newSupporter.profile?.address as string,
          city: newSupporter.profile?.city as string,
          country: newSupporter.profile?.country as string,
          postcode: newSupporter.profile?.postcode as string,
          state: newSupporter.profile?.state as string,
          description: newSupporter.profile?.description as string,
        },
      });
      // console.log(createAccountStripe);
      if (!createAccountStripe || !createAccountStripe.id) {
        throw new HttpException(
          cResponseData({
            message: 'Failed to create Stripe account',
            data: null,
            error: 'Stripe account creation failed',
            success: false,
          }),
          HttpStatus.BAD_REQUEST,
        );
      }
      // update user db stripeAccountId field
      await this.prisma.user.update({
        where: { id: newSupporter.id },
        data: { stripeAccountId: createAccountStripe.id },
      });
      // create onboarding link for supporter
      const linkOnboarding = await this.stripe.createOnboardingAccountLink(
        createAccountStripe.id,
      );

      const jwtData = await this.userCredentialsAuthenticationWithSignUp({
        id: newSupporter.id,
        provider: newSupporter.provider,
        username: newSupporter.username,
        email: newSupporter.email,
        role: newSupporter.role,
        profile:
          newSupporter.profile && newSupporter.profile.name
            ? {
                name: newSupporter.profile.name,
                image: newSupporter.profile.image,
              }
            : null,
        shop: newSupporter.shop,
        memberships_owner: newSupporter.memberships_owner,
        stripeAccountId: newSupporter.stripeAccountId,
        varify: newSupporter.varify,
      });

      return {
        message: 'Supporter account created successfully',
        redirect_url: linkOnboarding.url,
        error: null,
        payload: jwtData,
        success: true,
      };
    } catch (error) {
      throw new HttpException(
        cResponseData({
          message: 'Failed to create supporter account',
          data: null,
          error: error instanceof Error ? error.message : String(error),
          success: false,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkUsername(username: string) {
    const regex = /^[a-z0-9_-]+$/;
    if (!regex.test(username)) {
      return {
        message:
          'Username must be lowercase and contain only letters and numbers without spaces.',
        success: false,
      };
    }
    const user = await this.prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
      },
    });
    return {
      message: !user ? 'Ok' : 'Username already exists',
      success: !user,
    };
  }

  async afterLoginVarifyAccountSystem(username: string, email: string) {
    const result = await this.prisma.user.findFirst({
      where: {
        username,
        deactivate: false,
      },
      select: {
        id: true,
        email: true,
        deactivate: true,
      },
    });
    if (!result || !result.id) return false;
    const updateVarify = await this.prisma.user.update({
      where: {
        id: result.id,
      },
      data: {
        varify: true,
        email: email,
      },
    });
    if (!updateVarify || !updateVarify.varify) return false;
    return true;
  }

  private async userCredentialsAuthenticationWithSignUp(
    user: authenticationUserDto | null,
  ) {
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
}
