import { Test, TestingModule } from '@nestjs/testing';
import { SupporterProfileService } from './supporter-profile.service';

describe('SupporterProfileService', () => {
  let service: SupporterProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupporterProfileService],
    }).compile();

    service = module.get<SupporterProfileService>(SupporterProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
