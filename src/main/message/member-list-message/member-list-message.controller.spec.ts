import { Test, TestingModule } from '@nestjs/testing';
import { MemberListMessageController } from './member-list-message.controller';
import { MemberListMessageService } from './member-list-message.service';

describe('MemberListMessageController', () => {
  let controller: MemberListMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberListMessageController],
      providers: [MemberListMessageService],
    }).compile();

    controller = module.get<MemberListMessageController>(
      MemberListMessageController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
