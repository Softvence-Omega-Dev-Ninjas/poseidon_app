import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return `This action creates a new order with data: ${JSON.stringify(createOrderDto)}`;
  }

  @Get()
  findAll() {
    return 'This action returns all orders';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} order`;
  }
}