import { Test, TestingModule } from '@nestjs/testing';
import { PermissionAccessController } from './permission-access.controller';
import { PermissionAccessService } from './permission-access.service';

describe('PermissionAccessController', () => {
  let controller: PermissionAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionAccessController],
      providers: [PermissionAccessService],
    }).compile();

    controller = module.get<PermissionAccessController>(PermissionAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
