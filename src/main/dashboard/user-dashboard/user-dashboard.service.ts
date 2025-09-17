import { Injectable } from '@nestjs/common';
import { CreateUserDashboardDto } from './dto/create-user-dashboard.dto';
import { UpdateUserDashboardDto } from './dto/update-user-dashboard.dto';

@Injectable()
export class UserDashboardService {
  create(createUserDashboardDto: CreateUserDashboardDto) {
    return 'This action adds a new userDashboard';
  }

  findAll() {
    return `This action returns all userDashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userDashboard`;
  }

  update(id: number, updateUserDashboardDto: UpdateUserDashboardDto) {
    return `This action updates a #${id} userDashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} userDashboard`;
  }
}
