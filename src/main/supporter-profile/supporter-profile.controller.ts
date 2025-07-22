import { Controller, Get, Param } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
// import { CreateSupporterProfileDto } from './dto/create-supporter-profile.dto';
// import { UpdateSupporterProfileDto } from './dto/update-supporter-profile.dto';
import { Public } from 'src/auth/guard/public.decorator';

@Public()
@Controller('supporter-profile')
export class SupporterProfileController {
  constructor(
    private readonly supporterProfileService: SupporterProfileService,
  ) {}

  @Get(':profile_id')
  getSupportCart(@Param() profile_id: string) {
    return profile_id;
  }
}
