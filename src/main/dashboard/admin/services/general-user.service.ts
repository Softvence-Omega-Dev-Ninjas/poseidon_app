import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/main/user/user.service';
import { Role } from 'src/auth/guard/role.enum';
import { cResponseData } from 'src/common/utils/common-responseData';

@Injectable()
export class GeneralUserService {
  constructor(private readonly userService: UserService) {}

  async findMany(currentPage: number, limit: number, query?: string) {
    try {
      return await this.userService.findAll(
        Role.User,
        Number(currentPage),
        Number(limit),
        query,
      );
    } catch (error: any) {
      console.log(error);

      throw new HttpException(
        cResponseData({
          success: false,
          message: error?.message,
        }),
        400,
      );
    }
  }

  async fineOne(id: string) {
    try {
      return await this.userService.findOne(id, Role.User);
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
      const deletedUser = await this.userService.softDelete(id, Role.User);
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
