import { Test, TestingModule } from '@nestjs/testing';
import { MemberListMessageService } from './member-list-message.service';

describe('MemberListMessageService', () => {
  let service: MemberListMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberListMessageService],
    }).compile();

    service = module.get<MemberListMessageService>(MemberListMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
