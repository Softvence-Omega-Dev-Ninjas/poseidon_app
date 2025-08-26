import { Test, TestingModule } from '@nestjs/testing';
import { MediafileController } from './mediafile.controller';
import { MediafileService } from './mediafile.service';

describe('MediafileController', () => {
  let controller: MediafileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediafileController],
      providers: [MediafileService],
    }).compile();

    controller = module.get<MediafileController>(MediafileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
