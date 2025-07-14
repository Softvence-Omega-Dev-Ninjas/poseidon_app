import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, MainModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
