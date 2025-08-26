import { Controller, Post, Body } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterPayDto } from './dto/create-supporter.dto';

@Controller('supporter')
export class SupporterController {
  constructor(private readonly supporterService: SupporterService) {}

  // @Get('profile_id')
  // getSupportCart(@Param() profile_id: string) {
  //   return this.supporterService.getSupportCart(profile_id);
  // }

  @Post('create-cart')
  createSupporterCartLayout() {
    return this.supporterService.createSupporterCartLayout();
  }

  @Post()
  create(@Body() createSupporterDto: CreateSupporterPayDto) {
    return this.supporterService.create(createSupporterDto);
  }
}
