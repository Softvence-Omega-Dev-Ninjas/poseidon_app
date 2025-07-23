import { Controller, Get, Param, Req } from '@nestjs/common';
import { SupporterProfileService } from './supporter-profile.service';
// import { CreateSupporterProfileDto } from './dto/create-supporter-profile.dto';
// import { UpdateSupporterProfileDto } from './dto/update-supporter-profile.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { Request } from 'express';

@Public()
@Controller('supporter-profile')
export class SupporterProfileController {
  constructor(
    private readonly supporterProfileService: SupporterProfileService,
  ) {}

  @Public()
  @Get(':profile_id')
  async getSupportCart(
    @Param('profile_id') profile_id: string,
    @Req() res: Request,
  ) {
    // try {
    const hPageData =
      await this.supporterProfileService.profilePage(profile_id);
    return {
      message: 'successfull',
      error: null,
      data: hPageData,
      success: true,
      editing: profile_id == res['sub'],
    };
    // } catch (error) {
    //   console.log(error);
    //   throw new HttpException(
    //     {
    //       message: 'failed',
    //       error: 'something went wrong',
    //       success: false,
    //       data: null,
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
  }
}
