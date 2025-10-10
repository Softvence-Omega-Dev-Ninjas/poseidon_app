import { Controller, Get, Param, Req } from '@nestjs/common';
import { VideoCallSchedulHistoryService } from './video-call-schedul-history.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';

@Controller('video-call-schedul-history')
export class VideoCallSchedulHistoryController {
  constructor(
    private readonly videoCallSchedulHistoryService: VideoCallSchedulHistoryService,
  ) {}

  @Roles(Role.Supporter)
  @Get()
  findAll(@Req() req: Request) {
    return this.videoCallSchedulHistoryService.findAll(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoCallSchedulHistoryService.findOne(id);
  }
}
