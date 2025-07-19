import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CredentialsSignInInfo } from 'src/auth/dto/create-auth.dto';
// import { UserInfoType } from './response.type';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthUserService {
  constructor(private readonly prisma: PrismaService) {}

  // chack user db isExestUser - yes or not
  private async isExestUser(email: string) {
    // try {
    const result = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        deactivate: true,
      },
    });
    if (result?.email && !result.deactivate) {
      return true;
    }
    return false;
    // } catch (error) {
    //   throw new InternalServerErrorException({
    //     massage: 'Something went wrong.',
    //     error: error instanceof Error ? error : String(error),
    //     data: null,
    //     success: false,
    //   });
    // }
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
          stutas: false,
        },
        HttpStatus.CONFLICT,
      );
    }
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          profile: {
            create: {
              ...createUserDto.profile,
            },
          },
          support_cart_layout: {
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
        error: null,
        data: newUser,
        stutas: true,
      };
    } catch (err) {
      throw new InternalServerErrorException({
        massage: 'user created fail',
        error: err instanceof Error ? err : String(err),
        data: null,
        success: false,
      });
    }
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
    try {
      const userinfo = await this.prisma.user.findFirst({
        where: {
          email: loginUserDto.email,
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
        },
      });
      if (!userinfo) {
        throw new BadRequestException('User not found');
      }
      // password match logic
      const { password, ...user } = userinfo;
      if (password !== loginUserDto.password) {
        throw new HttpException(
          {
            message: 'Incorrect credentials. Please try again.',
            redirect_url: null,
            error: 'INVALID_PASSWORD',
            data: null,
            success: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        ...user,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        massage: 'Something went wrong.',
        error: error instanceof Error ? error : String(error),
        data: null,
        success: false,
      });
    }
  }
}
