import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CredentialsSignInInfo } from 'src/auth/dto/create-auth.dto';
import * as argon2 from 'argon2';
import { SellerService } from 'src/utils/stripe/seller.service';
import { cResponseData } from 'src/common/utils/common-responseData';
// import { UserInfoType } from './response.type';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: SellerService,
  ) {}

  // chack user db isExestUser - yes or not
  private async isExestUser(email: string) {
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

  // credentials register system
  async createUser(createUserDto: CreateUserDto) {
    const userIsExest = await this.isExestUser(createUserDto.email);
    if (userIsExest) {
      throw new HttpException(
        {
          message: 'Your Have all ready register please login',
          redirect_url: 'http://localhost:3000/signin',
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
      return await this.createSupporterAccount({
        ...createUserDto,
        password: hashedPassword,
      });
    }
    // create new user
    // create a hash password
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role as 'user',
        profile: {
          create: {
            ...createUserDto.profile,
          },
        },
      },
      select: {
        id: true,
        email: true,
        provider: true,
        profile: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return {
      message: 'Your Have SignUp Successful',
      redirect_url: 'http://localhost:3000/signin',
      error: null,
      data: { name: newUser.profile?.name },
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
        email: true,
        password: true,
        role: true,
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
          where: {
            enableMembership: true,
          },
          select: { id: true },
        },
      },
    });
  }

  // create supporter account
  private async createSupporterAccount(createUserDto: CreateUserDto) {
    try {
      // If the user is a supporter, create a support_cart_layout
      console.log('createSupporterAccount......');
      const newSupporter = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          role: createUserDto.role as 'supporter',
          profile: {
            create: {
              ...createUserDto.profile,
            },
          },
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
          profile: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      // create stripe connected account for supporter
      const createAccountStripe = await this.stripe.createConnectedAccount(
        newSupporter.email,
        newSupporter.id,
        newSupporter.profile?.name || 'No name',
      );
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
      return {
        message: 'Supporter account created successfully',
        redirect_url: linkOnboarding.url,
        error: null,
        data: { name: newSupporter.profile?.name },
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
}
