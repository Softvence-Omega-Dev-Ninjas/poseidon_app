import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFiller } from './common/fillters/http-exception.fillter';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guard/auth.guard';

import { PrismaClientModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [
    PrismaClientModule,
    AuthModule,
    MainModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('AUTHSECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFiller,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
