import { Global, Module } from '@nestjs/common';
import { GlobalMailService } from './global-mail.service';

@Global()
@Module({
  providers: [GlobalMailService],
  exports: [GlobalMailService],
})
export class GlobalMailModule {}
