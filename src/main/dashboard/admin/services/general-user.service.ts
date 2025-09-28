import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import { UserService } from 'src/main/user/user.service';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class GeneralUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async findMany(currentPage: number, limit: number) {
    // Validate page and limit
    if (isNaN(currentPage) || currentPage < 1) {
      throw new Error('Invalid page number');
    }

    // Fetch total count of users with the Supporter role
    const totalItemCount = await this.prisma.user.count({
      where: {
        role: Role.User,
      },
    });
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItemCount / limit);

    // Fetch users based on pagination
    const users = await this.prisma.user.findMany({
      where: {
        role: Role.User,
      },
      omit: {
        password: true,
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Prepare the pagination response object
    const paginationResponse = {
      currentPage,
      pageSize: limit,
      totalItems: totalItemCount,
      totalPages,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      users, // Users for the current page
    };
    return paginationResponse;
  }

  async remove(id: string) {
    try {
      let user = await this.prisma.user.findUnique({
        where: {
          id,
          role: Role.User,
        },
        omit: {
          password: true,
        },
      });

      if (!user) {
        return cResponseData({
          message: `General user with ID ${id} not found`,
          error: 'NotFound',
          data: null,
          success: false,
        });
      }
      user = await this.prisma.user.delete({
        where: {
          id,
          role: Role.User,
        },
        omit: {
          password: true,
        },
      });

      return cResponseData({
        message: `Star with ID ${id} has been deleted`,
        error: null,
        data: user
          ? {
              id: user.id,
              role: user.role,
            }
          : null,
        success: true,
      });
    } catch (error: any) {
      return cResponseData({
        message: 'Failed to delete star.',
        error: error.message,
        data: null,
        success: false,
      });
    }
  }

  async fineOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
          role: Role.User,
        },
        omit: {
          password: true,
        },
      });
      if (!user) throw new Error('User not found');

      return user;
    } catch (error: any) {
      cResponseData({
        success: false,
        message: error?.message,
      });
    }
  }
}
