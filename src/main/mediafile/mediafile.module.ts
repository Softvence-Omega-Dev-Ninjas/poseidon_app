import { Module } from '@nestjs/common';
import { MediafileController } from './mediafile.controller';

@Module({
  controllers: [MediafileController],
  providers: [],
})
export class MediafileModule {}
