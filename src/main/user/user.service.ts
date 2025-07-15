import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        profile: {
          create: {
            ...createUserDto.profile,
          },
        },
        // support_cart_layout: {
        //   create: {},
        // },
      },
    });
    return newUser;
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
