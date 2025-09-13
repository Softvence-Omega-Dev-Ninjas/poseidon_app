import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { SellerService } from 'src/utils/stripe/seller.service';
import { Public } from 'src/auth/guard/public.decorator';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { Request } from 'express';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly sellerService: SellerService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(Role.Supporter)
  @Get('supporter/financial')
  financial(@Req() req: Request) {
    return this.sellerService.financialServices(
      req['stripeAccountId'] as string,
    );
  }

  @Public()
  @Delete('stripeAccount/:id')
  deleteStripeAccount(@Param('id') id: string) {
    return this.sellerService.deleteAccount(id);
  }
}
