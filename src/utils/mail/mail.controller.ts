import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { AdminMailDto, AdminMailUseMultiUserDto } from './dto/adminMail.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Roles(Role.Admin)
  @Post('/admin/send-email')
  async sendEmail(@Body() data: AdminMailDto) {
    return await this.mailService.sendEmailUseToAdmin(
      data.email,
      data.subject,
      data.message,
    );
  }

  @Roles(Role.Admin)
  @Post('/admin/send-emails-multiUser')
  async multiUserSendEmail(@Body() data: AdminMailUseMultiUserDto) {
    return await this.mailService.multiUserSendEmail(
      data.emails,
      data.subject,
      data.message,
    );
  }
}
