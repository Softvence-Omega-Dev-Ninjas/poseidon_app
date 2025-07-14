import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupporterService } from './supporter.service';
import { CreateSupporterDto } from './dto/create-supporter.dto';
import { UpdateSupporterDto } from './dto/update-supporter.dto';

@Controller('supporter')
export class SupporterController {
  constructor(private readonly supporterService: SupporterService) {}

  @Post()
  create(@Body() createSupporterDto: CreateSupporterDto) {
    return this.supporterService.create(createSupporterDto);
  }

  @Get()
  findAll() {
    return this.supporterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supporterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSupporterDto: UpdateSupporterDto) {
    return this.supporterService.update(+id, updateSupporterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supporterService.remove(+id);
  }
}
