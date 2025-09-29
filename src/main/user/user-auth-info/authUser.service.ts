import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CredentialsSignInInfo } from 'src/auth/dto/create-auth.dto';
import * as argon2 from 'argon2';
import { SellerService } from 'src/utils/stripe/seller.service';
import { cResponseData } from 'src/common/utils/common-responseData';
// import { v4 as uuidv4 } from 'uuid';
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
  // credentials register system
  async createUser(createUserDto: CreateUserDto, skip: boolean) {
    // const { skip, ...createUserDto } = data;
    // console.log('createUserDto ========++++++++000000', createUserDto);
    const userIsExest = await this.isExestUser(createUserDto.email);
    if (userIsExest) {
      throw new HttpException(
        {
          message: 'Your Have all ready register please login',
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
      redirect_url: `${process.env.FRONTEND_URL}/login`,
      error: null,
      data: { name: newUser.profile?.name },
      success: true,
    };
  }

  //   async createUser(createUserDto: CreateUserDto, skip: boolean) {
  //   const userIsExest = await this.isExestUser(createUserDto.email);
  //   if (userIsExest) {
  //     throw new HttpException(
  //       {
  //         message: 'You already registered, please login',
  //         redirect_url: `${process.env.FRONTEND_URL}/login`,
  //         error: null,
  //         data: null,
  //         success: false,
  //       },
  //       HttpStatus.CONFLICT,
  //     );
  //   }

  //   const hashedPassword = await argon2.hash(createUserDto.password);

  //   let newUser;
  //   if (createUserDto.role === 'supporter') {
  //     newUser = await this.createSupporterAccount(
  //       {
  //         ...createUserDto,
  //         password: hashedPassword,
  //       },
  //       skip,
  //     );
  //   } else {
  //     newUser = await this.prisma.user.create({
  //       data: {
  //         email: createUserDto.email,
  //         username: createUserDto.username,
  //         password: hashedPassword,
  //         role: createUserDto.role as 'user',
  //         profile: {
  //           create: {
  //             ...createUserDto.profile,
  //           },
  //         },
  //       },
  //       select: {
  //         id: true,
  //         email: true,
  //         provider: true,
  //         profile: {
  //           select: {
  //             name: true,
  //             image: true,
  //           },
  //         },
  //       },
  //     });
  //   }

  //   //  Referral logic
  //   if (createUserDto.referrerId) {
  //     const inviter = await this.prisma.user.findUnique({
  //       where: { id: createUserDto.referrerId },
  //     });
  //     if (inviter) {
  //       await this.prisma.referral.create({
  //         data: {
  //           inviterId: inviter.id,
  //           invitedId: newUser.id,
  //         },
  //       });
  //     }
  //   }

  //   return {
  //     message: 'Signup successful',
  //     redirect_url: `${process.env.FRONTEND_URL}/login`,
  //     error: null,
  //     data: { name: newUser.profile?.name },
  //     success: true,
  //   };
  // }

  //   // const { skip, ...createUserDto } = data;
  //   console.log('createUserDto ========++++++++000000', createUserDto);
  //   const userIsExest = await this.isExestUser(createUserDto.email);
  //   if (userIsExest) {
  //     throw new HttpException(
  //       {
  //         message: 'Your Have all ready register please login',
  //         redirect_url: `${process.env.FRONTEND_URL}/login`,
  //         error: null,
  //         data: null,
  //         success: false,
  //       },
  //       HttpStatus.CONFLICT,
  //     );
  //   }
  //   const hashedPassword = await argon2.hash(createUserDto.password);
  //   // create new supporter
  //   if (createUserDto.role === 'supporter') {
  //     return await this.createSupporterAccount(
  //       {
  //         ...createUserDto,
  //         password: hashedPassword,
  //       },
  //       skip,
  //     );
  //   }
  //   // create new user
  //   // create a hash password
  //   const newUser = await this.prisma.user.create({
  //     data: {
  //       email: createUserDto.email,
  //       username: createUserDto.username,
  //       password: hashedPassword,
  //       role: createUserDto.role as 'user',
  //       profile: {
  //         create: {
  //           ...createUserDto.profile,
  //         },
  //       },
  //     },
  //     select: {
  //       id: true,
  //       email: true,
  //       provider: true,
  //       profile: {
  //         select: {
  //           name: true,
  //           image: true,
  //         },
  //       },
  //     },
  //   });
  //   return {
  //     message: 'Your Have SignUp Successful',
  //     redirect_url: `${process.env.FRONTEND_URL}/login`,
  //     error: null,
  //     data: { name: newUser.profile?.name },
  //     success: true,
  //   };
  // }

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
    console.log('createUserDto =====++++++', createUserDto);
    try {
      // If the user is a supporter, create a support_cart_layout
      console.log('createSupporterAccount......');
      const newSupporter = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
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
          username: true,
          profile: {
            select: {
              name: true,
              address: true,
              city: true,
              country: true,
              postcode: true,
              state: true,
              description: true,
            },
          },
        },
      });

      if (skip) {
        return {
          message: 'Supporter account created successfully',
          redirect_url: `${process.env.FRONTEND_URL}/login`,
          error: null,
          data: { name: newSupporter.profile?.name },
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
      console.log(createAccountStripe);
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

  async checkUsername(username: string) {
    const regex = /^[a-z0-9]+$/;
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
}
