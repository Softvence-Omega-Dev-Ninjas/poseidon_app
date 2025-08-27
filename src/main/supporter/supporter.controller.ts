import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { cResponseData } from 'src/common/utils/common-responseData';
import { Request } from 'express';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { CheersLivePackageType } from './dto/create-supporter-layout';

@Controller('supporter')
export class SupporterController {
  constructor(private readonly supporterService: SupporterService) {}

  @Roles(Role.Supporter)
  @Patch('update-cart')
  createSupporterCartLayout(
    @Body() data: UpdateSupporterLayputDto,
    @Req() req: Request,
  ) {
    // return this.supporterService.createSupporterCartLayout();
    console.log('=========', req);
    return { user: req['sub'] as string, data };
  }

  @Roles(Role.Supporter)
  @Post('CreateCheersLivePackageType/:id')
  createCheersLivePackageType(
    @Param('id') id: string,
    @Body() data: CheersLivePackageType,
  ) {
    return this.supporterService.createCheersLivePackageType(id, data);
  }

  @Public()
  @Post('create-suggest-quantity')
  createSuggestUpdateQuantity(@Body() data: SupportCartLayoutQuantity) {
    return this.supporterService.createSuggestQuantity(data);
  }

  @Delete('create-suggest-quantity/:id')
  deleteSuggestQuantity(@Param('id') id: string) {
    const dlt = this.supporterService.deleteSuggestQuantity(id);
    return cResponseData({
      message: 'Delete Success',
      data: dlt,
    });
  }

  @Post('payment')
  create(@Body() createSupporterDto: CreateSupporterPayDto) {
    return this.supporterService.create(createSupporterDto);
  }
}
