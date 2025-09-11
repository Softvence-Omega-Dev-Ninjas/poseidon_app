import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './config/swagger';
// import cookieParser from 'cookie-parser';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // (app as any).use(cookieParser());

  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(process.cwd(), 'public'), {
  //   // Optionally set prefix if you want URL like /static/sharif.txt
  //   // prefix: '/static',
  // });

  SwaggerSetting(app);
  app.enableCors({
    origin: true, // 🔑 allow any origin dynamically
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
