import { Injectable } from '@nestjs/common';
import { CreateSupporterProfileDto } from './dto/create-supporter-profile.dto';
import { UpdateSupporterProfileDto } from './dto/update-supporter-profile.dto';

@Injectable()
export class SupporterProfileService {
  create(createSupporterProfileDto: CreateSupporterProfileDto) {
    return 'This action adds a new supporterProfile';
  }

  findAll() {
    return `This action returns all supporterProfile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supporterProfile`;
  }

  update(id: number, updateSupporterProfileDto: UpdateSupporterProfileDto) {
    return `This action updates a #${id} supporterProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} supporterProfile`;
  }
}
