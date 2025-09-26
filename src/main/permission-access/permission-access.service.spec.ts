import { Test, TestingModule } from '@nestjs/testing';
import { PermissionAccessService } from './permission-access.service';

describe('PermissionAccessService', () => {
  let service: PermissionAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionAccessService],
    }).compile();

    service = module.get<PermissionAccessService>(PermissionAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
