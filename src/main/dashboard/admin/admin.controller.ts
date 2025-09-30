import { Controller, Delete, Get, Param, Query, Req } from '@nestjs/common';
import { AdminOverviewService } from './services/overview.service';
import { AdminBarStarService } from './services/bar-stars.service';
import { Roles } from 'src/auth/guard/roles.decorator';
import { Role } from 'src/auth/guard/role.enum';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GeneralUserService } from './services/general-user.service';
import { Public } from 'src/auth/guard/public.decorator';
import { cResponseData } from 'src/common/utils/common-responseData';

@Controller('admin-dashboard')
export class AdminController {
  constructor(
    private readonly overviewService: AdminOverviewService,
    private readonly barStarsService: AdminBarStarService,
    private readonly generalUserService: GeneralUserService,
  ) {}

  @Get('stats')
  @Roles(Role.Admin)
  getStats(@Req() res: Request) {
    return this.overviewService.getStats();
  }

  @Get('income-stats')
  @Roles(Role.Admin)
  @ApiQuery({
    name: 'month',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'year',
    required: true,
    type: Number,
  })
  async getIncomeStats(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    // TODO(coderboysobu) validate params before continue
    return this.overviewService.getIncomeStats(Number(month), Number(year));
  }

  // Bar stars
  @Get('bar-stars')
  @Roles(Role.Admin)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  getBarStars(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() res: Request,
  ) {
    return this.barStarsService.findMany(page, limit);
  }

  @Get('bar-stars/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'View by bar star id' })
  async getBarStar(@Param('id') id: string) {
    return this.barStarsService.findOne(id);
  }

  @Delete('bar-stars/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a general user with id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteBarStar(@Param('id') id: string) {
    return this.barStarsService.remove(id);
  }

  // General user
  @Get('general-user')
  @Roles(Role.Admin)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  getGeneralUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() res: Request,
  ) {
    return this.generalUserService.findMany(page, limit);
  }

  @Get('general-user/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'View by general user id' })
  async getGeneralUser(@Param('id') id: string) {
    return this.generalUserService.fineOne(id);
  }

  @Delete('general-user/:id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a general user by general user id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteGeneralUser(@Param('id') id: string) {
    return this.generalUserService.remove(id);
  }
}
