import { Controller, Get, Req } from '@nestjs/common';
import { MemberListMessageService } from './member-list-message.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Public } from 'src/auth/guard/public.decorator';
// import { CreateMemberListMessageDto } from './dto/create-member-list-message.dto';
// import { UpdateMemberListMessageDto } from './dto/update-member-list-message.dto';

@Controller('member-list-message')
export class MemberListMessageController {
  constructor(
    private readonly memberListMessageService: MemberListMessageService,
  ) {}

  // @Roles(Role.User)
  @Public()
  @Get('use-user')
  findAll(@Req() req: Request) {
    return this.memberListMessageService.findMembershipList(
      req['sub'] as string,
    );
  }
}
