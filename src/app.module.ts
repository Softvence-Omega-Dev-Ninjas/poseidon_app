import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFiller } from './common/fillters/http-exception.fillter';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { ContinueModule } from './continue/continue.module';
import { TrackVisitMiddleware } from './main/middlewares/track.middleware';
import { UserModule } from './main/user/user.module';
import { MailModule } from './utils/mail/mail.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    PrismaClientModule,
    AuthModule,
    ContinueModule,
    UserModule,
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
    MailModule,
    UploadsModule,
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
    TrackVisitMiddleware,
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TrackVisitMiddleware) // Apply the middleware here
      .forRoutes('*'); // Apply to all routes or specify particular routes
  }
}
