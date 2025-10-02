import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { CreateLoginDto } from '../dto/create-or-login';
import { PrismaTx } from 'src/@types';
import { userSelect } from './utils/select';

@Injectable()
export class AuthHandlerRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: userSelect,
    });
  }
  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: userSelect,
    });
  }
  async createAuthProvider(input: CreateLoginDto, refUserId?: string) {
    return await this.prisma.$transaction(async (tx: PrismaTx) => {
      if (input.role === 'supporter' || input.role === 'user') {
        // if user role is supporter then create supporter account with profile, support_cart_layout, shop, memberships_owner
        const user = this.createSuppporter(input, tx, refUserId);
        if (!user)
          throw new InternalServerErrorException('Fail to create user');

        return user;
      } else {
        throw new ConflictException(
          'You cant create your account out of our predefine role',
        );
      }
    });
  }
  async create(input: CreateLoginDto) {}

  private async createSuppporter(
    input: CreateLoginDto,
    tx: PrismaTx,
    refUserId?: string,
  ) {
    // extract profile
    const profile = input.profile;
    if (refUserId && input.role === 'user') {
      return await tx.user.create({
        data: {
          ...input,
          username: input.username ?? '',
          email: input.email ?? '',
          password: '',
          role: input.role,
          provider: input.provider,
          profile: {
            create: {
              ...profile,
              image: (profile && profile.image) ?? '',
              name: (profile && profile.name) ?? '',
            },
          },
          invited: {
            create: {
              inviterId: refUserId,
            },
          },
        },
        select: userSelect,
      });
    }
    return await tx.user.create({
      data: {
        ...input,
        username: input.username!,
        email: input.email ?? '',
        password: '',
        role: input.role,
        provider: input.provider,
        profile: {
          create: {
            ...profile,
            image: (profile && profile.image) ?? '',
            name: (profile && profile.name) ?? '',
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
      select: userSelect,
    });
  }
}
