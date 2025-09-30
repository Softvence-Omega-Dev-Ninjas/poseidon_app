import { Controller, Get, Req } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';

@Controller('permissions')
export class PermissionController {
  constructor(private permService: PermissionService) {}

  @Roles(Role.Supporter, Role.User)
  @Get('messages/allowed-for-me')
  async allowedSupporters(@Req() req: Request) {
    return this.permService.getMessagePermittedSupportersForUser(
      req['sub'] as string,
    );
  }

  @Roles(Role.Supporter, Role.User)
  @Get('messages/i-can-message')
  async iCanMessage(@Req() req: Request) {
    return this.permService.getUsersThatSupporterCanMessage(
      req['sub'] as string,
    );
  }
}
