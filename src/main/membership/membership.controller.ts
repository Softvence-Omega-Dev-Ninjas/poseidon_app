import {
  Controller,
  Get,
  // Body,
  // Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
// import { CreateMembershipDto } from './dto/create-membership.dto';
// import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Roles(Role.Supporter)
  @Get('enable-membership')
  create(@Req() req: Request) {
    return this.membershipService.enableMembership(req['sub'] as string);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateMembershipDto: UpdateMembershipDto,
  // ) {
  //   return this.membershipService.update(+id, updateMembershipDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipService.remove(+id);
  }
}
