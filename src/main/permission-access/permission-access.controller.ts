import {
  // Body,
  Controller,
  Get,
  HttpException,
  Query,
  Req,
} from '@nestjs/common';
import { PermissionAccessService } from './permission-access.service';
// import { AccesPermissionAccessDto } from './dto/create-permission-access.dto';
// import { Public } from 'src/auth/guard/public.decorator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';
import { cResponseData } from 'src/common/utils/common-responseData';
// import { Public } from 'src/auth/guard/public.decorator';

@Controller('permission-access')
export class PermissionAccessController {
  constructor(
    private readonly permissionAccessService: PermissionAccessService,
  ) {}

  // @Public()
  @Roles(Role.User, Role.Supporter)
  @Get()
  findAll(
    // @Body() accesPermissionAccessDto: AccesPermissionAccessDto,
    @Req() req: Request,
    @Query('berGirlId') berGirlId: string,
  ) {
    if (!berGirlId) {
      throw new HttpException(
        cResponseData({
          message: 'berGirlId is required',
          error: 'berGirlId is required',
          success: false,
          data: null,
        }),
        400,
      );
    }
    return this.permissionAccessService.findAccesPermit(
      req['sub'] as string,
      berGirlId,
    );
  }
}
