import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MainModule } from './main/main.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFiller } from './common/fillters/http-exception.fillter';
import { PostModule } from './main/post/post.module';
import { CommentModule } from './main/comment/comment.module';
import { LikeModule } from './main/like/like.module';

@Module({
  imports: [
    AuthModule,
    MainModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PostModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFiller,
    },
  ],
})
export class AppModule {}
