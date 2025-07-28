import { Controller, Get, Req } from '@nestjs/common';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';
// import { Public } from './auth/guard/public.decorator';
// import { Response } from 'express';
// import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Roles(Role.Admin, Role.Supporter, Role.User)
  // @Public()
  getHello(@Req() res: Request): string {
    console.log(res['sub']);
    return 'welcome to poseidon project';
  }

  // @Get('sharif.txt')
  // getText(@Res() res: Response) {
  //   const filePath = join(process.cwd(), 'public', 'sharif.txt');

  //   // Set headers to force download
  //   res.set({
  //     'Content-Type': 'text/plain',
  //     'Content-Disposition': 'attachment; filename="sharif.txt"',
  //   });

  //   return res.sendFile(filePath);
  // }
}
