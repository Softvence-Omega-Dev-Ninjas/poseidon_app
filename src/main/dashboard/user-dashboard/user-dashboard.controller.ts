import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserDashboardService } from './user-dashboard.service';
import { CreateUserDashboardDto } from './dto/create-user-dashboard.dto';
import { UpdateUserDashboardDto } from './dto/update-user-dashboard.dto';

@Controller('user-dashboard')
export class UserDashboardController {
  constructor(private readonly userDashboardService: UserDashboardService) {}

  @Post()
  create(@Body() createUserDashboardDto: CreateUserDashboardDto) {
    return this.userDashboardService.create(createUserDashboardDto);
  }

  @Get()
  findAll() {
    return this.userDashboardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDashboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDashboardDto: UpdateUserDashboardDto,
  ) {
    return this.userDashboardService.update(+id, updateUserDashboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDashboardService.remove(+id);
  }
}
