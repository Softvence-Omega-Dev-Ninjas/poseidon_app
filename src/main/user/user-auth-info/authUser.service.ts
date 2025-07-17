import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthUserService {
  constructor(private readonly prisma: PrismaService) {}

  // chack user db isExestUser - yes or not
  private async isExestUser(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        deactivate: true,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      // const newUser = await this.prisma.user.create({
      //   data: {
      //     email: createUserDto.email,
      //     password: createUserDto.password,
      //     profile: {
      //       create: {
      //         ...createUserDto.profile,
      //       },
      //     },
      //     // support_cart_layout: {
      //     //   create: {},
      //     // },
      //   },
      // });
      return await this.isExestUser(createUserDto.email);
    } catch (err) {
      throw new InternalServerErrorException({
        massage: 'user created fail',
        error: err instanceof Error ? err : String(err),
        data: null,
        status: false,
      });
    }
  }

  async findAll() {
    const allUser = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
    return allUser;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async deleteUserId(id: string) {
    const dltUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return dltUser;
  }
}
