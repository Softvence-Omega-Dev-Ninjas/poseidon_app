import { Controller, Post, Get, Body, Param, Req, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Request } from 'express';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req['sub'] as string);
  }

  @Get()
  findAll(@Query() query: FindAllOrdersDto) { 
    return this.orderService.findAll(query);
  }

  @Get('user')
  findAllByUserId(@Req() req: Request) {
    return this.orderService.findAllByUserId(req['sub'] as string);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
