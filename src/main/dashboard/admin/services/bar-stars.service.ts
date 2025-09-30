import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/main/user/user.service';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class AdminBarStarService {
  constructor(private readonly userService: UserService) {}

  async findMany(currentPage: number, limit: number, query?: string) {
    try {
      return await this.userService.findAll(
        Role.Supporter,
        Number(currentPage),
        Number(limit),
        query,
      );
    } catch (error: any) {
      throw new HttpException(
        cResponseData({
          success: false,
          message: error?.message,
        }),
        400,
      );
    }
  }

  async findOne(id: string) {
    try {
      return await this.userService.findOne(id, Role.Supporter);
    } catch (error: any) {
      throw new HttpException(
        cResponseData({
          success: false,
          message: error?.message,
        }),
        404,
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedUser = await this.userService.softDelete(id, Role.Supporter);
      return cResponseData({
        message: `${deletedUser.username} has been deleted`,
        error: null,
        data: deletedUser
          ? {
              id: deletedUser.id,
              role: deletedUser.role,
            }
          : null,
        success: true,
      });
    } catch (error: any) {
      throw new HttpException(
        cResponseData({
          success: false,
          message: error?.message,
        }),
        400,
      );
    }
  }
}
