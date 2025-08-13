import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
// import { CreateMembershipDto } from './dto/create-membership.dto';
// import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  // Enable membership for a specific supporter user
  enableMembership(userId: string) {
    return userId;
  }

  findAll() {
    return `This action returns all membership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membership`;
  }

  // update(id: number, updateMembershipDto: UpdateMembershipDto) {
  //   return `This action updates a #${id} membership`;
  // }

  remove(id: number) {
    return `This action removes a #${id} membership`;
  }
}
