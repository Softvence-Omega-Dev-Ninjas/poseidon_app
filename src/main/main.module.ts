import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { SupporterModule } from './supporter/supporter.module';

@Module({
  imports: [UserModule, SupporterModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}
