import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './config/swagger';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
// import cookieParser from 'cookie-parser';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'some_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  app.use(cookieParser());
  // (app as any).use(cookieParser());

  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(process.cwd(), 'public'), {
  //   // Optionally set prefix if you want URL like /static/sharif.txt
  //   // prefix: '/static',
  // });

  // console.log(new Date('2025-09-18'));

  SwaggerSetting(app);
  app.enableCors({
    origin: true, // 🔑 allow any origin dynamically
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
