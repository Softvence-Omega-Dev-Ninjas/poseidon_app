import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
// import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { CreateMembershipLevelDto } from './dto/create-membership-level.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ImageValidationPipe } from 'src/common/utils/image-validation.pipe';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Roles(Role.Supporter)
  @Get('enable-membership')
  enableMembership(@Req() req: Request) {
    return this.membershipService.enableMembership(req['sub'] as string);
  }

  @Roles(Role.Supporter)
  @Post('create-levels')
  @UseInterceptors(FileInterceptor('levelImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMembershipLevelDto })
  createMembershipLevel(
    @Body() createMembershipLevelDto: CreateMembershipLevelDto,
    @UploadedFile(new ImageValidationPipe()) levelImage: Express.Multer.File,
  ) {
    return this.membershipService.createMembershipLevel({
      ...createMembershipLevelDto,
      levelImage,
    });
  }
}
