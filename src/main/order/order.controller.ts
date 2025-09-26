import { Controller, Post, Get, Body, Req, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Role } from 'src/auth/guard/role.enum';
import { Roles } from 'src/auth/guard/roles.decorator';
// import { Public } from 'src/auth/guard/public.decorator';
import {
  FindAllOrdersDto,
  GetOrderItemWithBerGirl,
} from './dto/find-all-orders.dto';
import { BuyMembershipResponseDto } from '../membership/onluUseUserMembershipInfo/dto/buyMembership.dto';
import { Request } from 'express';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.User, Role.Supporter)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req['sub'] as string);
  }

  @Get()
  @Roles(Role.Supporter, Role.Admin, Role.User)
  async findAll(@Query() query: FindAllOrdersDto) {
    return this.orderService.findAll(query);
  }

  // @Get(':id')
  // @Roles(Role.Supporter, Role.User)
  // findOne(@Param('id') id: string) {
  //   return this.orderService.findOne(id);
  // }

  // this Api use to ber girl
  @Get('getOrders-bg')
  @Roles(Role.Supporter)
  getAllOrderWithBerGirl(
    @Req() req: Request,
    @Query() query: GetOrderItemWithBerGirl,
  ) {
    console.log('getOrders-bg');
    return this.orderService.getAllOrderWithBerGirl(
      req['sub'] as string,
      query,
    );
  }

  @Post('paymentStatusCheck')
  @Roles(Role.Supporter, Role.User)
  paymentStatusCheck(@Body() body: BuyMembershipResponseDto) {
    return this.orderService.paymentStatusCheck(body);
  }

  @Get('gettop3card')
  @Roles(Role.Supporter)
  getTop3Card(@Req() req: Request) {
    return this.orderService.getTop3Card(req['sub'] as string);
  }
}
