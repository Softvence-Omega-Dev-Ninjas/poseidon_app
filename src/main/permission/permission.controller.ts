import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@Controller('permissions')
export class PermissionController {
  constructor(private permService: PermissionService) {}

  @Roles(Role.Supporter, Role.User)
  @Get('messages/allowed-for-me')
  async allowedSupporters(@Req() req: any) {
    return this.permService.getMessagePermittedSupportersForUser(req?.sub);
  }

  @Roles(Role.Supporter, Role.User)
  @Get('messages/i-can-message')
  async iCanMessage(@Req() req: any) {
    return this.permService.getUsersThatSupporterCanMessage(req?.sub);
  }
}
