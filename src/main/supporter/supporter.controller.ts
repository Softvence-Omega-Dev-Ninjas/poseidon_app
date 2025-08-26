import { Controller, Post, Body, Patch } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';
import { UpdateSupporterLayputDto } from './dto/update-supporter.dto';

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
    return data;
  }

  @Post()
  create(@Body() createSupporterDto: CreateSupporterPayDto) {
    return this.supporterService.create(createSupporterDto);
  }
}
