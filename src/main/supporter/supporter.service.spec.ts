import { Test, TestingModule } from '@nestjs/testing';
import { SupporterService } from './supporter.service';
import { PrismaService } from 'src/prisma-client/prisma-client.service';

describe('SupporterService', () => {
  let service: SupporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupporterService,
        { provide: PrismaService, useValue: {} }, // Mock PrismaService
      ],
    }).compile();

    service = module.get<SupporterService>(SupporterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
