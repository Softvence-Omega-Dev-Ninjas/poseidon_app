import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './config/swagger';
import * as dotenv from 'dotenv';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.useStaticAssets(join(process.cwd(), 'public'), {
  //   // Optionally set prefix if you want URL like /static/sharif.txt
  //   // prefix: '/static',
  // });

  SwaggerSetting(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
