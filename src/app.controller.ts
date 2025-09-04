import { Controller, Get, Req } from '@nestjs/common';

import { Request } from 'express';
import { Public } from './auth/guard/public.decorator';
// import { Response } from 'express';
// import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Public()
  getHello(@Req() res: Request): string {
    return 'welcome to poseidon project server with docker';
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
