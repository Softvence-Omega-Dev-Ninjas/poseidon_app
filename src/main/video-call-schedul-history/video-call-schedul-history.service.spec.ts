import { Test, TestingModule } from '@nestjs/testing';
import { VideoCallSchedulHistoryService } from './video-call-schedul-history.service';

describe('VideoCallSchedulHistoryService', () => {
  let service: VideoCallSchedulHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCallSchedulHistoryService],
    }).compile();

    service = module.get<VideoCallSchedulHistoryService>(VideoCallSchedulHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
