import { Test, TestingModule } from '@nestjs/testing';
import { SupporterController } from './supporter.controller';
import { SupporterService } from './supporter.service';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

describe('SupporterController', () => {
  let controller: SupporterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupporterController],
      providers: [
        SupporterService,
        { provide: PrismaService, useValue: {} }, // Mock PrismaService
      ],
    }).compile();

    controller = module.get<SupporterController>(SupporterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
