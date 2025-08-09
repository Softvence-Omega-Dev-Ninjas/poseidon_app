import { Test, TestingModule } from '@nestjs/testing';
import { SupporterProfileController } from './supporter-profile.controller';
import { SupporterProfileService } from './supporter-profile.service';

describe('SupporterProfileController', () => {
  let controller: SupporterProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupporterProfileController],
      providers: [SupporterProfileService],
    }).compile();

    controller = module.get<SupporterProfileController>(
      SupporterProfileController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
