import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuardGuard } from 'src/auth/auth_guard/auth_guard.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@UseGuards(AuthGuardGuard)
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