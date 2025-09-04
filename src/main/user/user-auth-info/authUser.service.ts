import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CredentialsSignInInfo } from 'src/auth/dto/create-auth.dto';
import * as argon2 from 'argon2';
// import { UserInfoType } from './response.type';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthUserService {
  constructor(private readonly prisma: PrismaService) {}

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
    // create a hash password
    const hashedPassword = await argon2.hash(createUserDto.password);
    // create new supporter
    if (createUserDto.role === 'supporter') {
      // If the user is a supporter, create a support_cart_layout
      const newSupporter = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
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
        data: { name: newSupporter.profile?.name },
        success: true,
      };
    }
    // create new user
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
}
