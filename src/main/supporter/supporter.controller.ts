import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';
import { SupportCartLayoutQuantity } from './dto/supportCartLayoutQuantity.dto';
import { Public } from 'src/auth/guard/public.decorator';
import { cResponseData } from 'src/common/utils/common-responseData';

@Controller('supporter')
export class SupporterController {
  constructor(private readonly supporterService: SupporterService) {}

  // @Get('profile_id')
  // getSupportCart(@Param() profile_id: string) {
  //   return this.supporterService.getSupportCart(profile_id);
  // }

  @Patch('update-cart')
  createSupporterCartLayout(@Body() data: UpdateSupporterLayputDto) {
    // return this.supporterService.createSupporterCartLayout();
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

  @Post()
  create(@Body() createSupporterDto: CreateSupporterPayDto) {
    return this.supporterService.create(createSupporterDto);
  }
}
