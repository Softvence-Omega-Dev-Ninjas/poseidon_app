import { Controller, Post, Get, Body, Param, Req, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
// import { Public } from 'src/auth/guard/public.decorator';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.User)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req['sub'] as string);
  }

  @Get()
  @Roles(Role.Supporter, Role.Admin, Role.User)
  async findAll(@Query() query: FindAllOrdersDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.Supporter, Role.User)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
}
