import { Test, TestingModule } from '@nestjs/testing';
import { VideoCallSchedulHistoryController } from './video-call-schedul-history.controller';
import { VideoCallSchedulHistoryService } from './video-call-schedul-history.service';

describe('VideoCallSchedulHistoryController', () => {
  let controller: VideoCallSchedulHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoCallSchedulHistoryController],
      providers: [VideoCallSchedulHistoryService],
    }).compile();

    controller = module.get<VideoCallSchedulHistoryController>(
      VideoCallSchedulHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
