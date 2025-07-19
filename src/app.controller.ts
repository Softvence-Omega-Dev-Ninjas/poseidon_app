import { Controller, Get } from '@nestjs/common';
// import { Response } from 'express';
// import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
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
