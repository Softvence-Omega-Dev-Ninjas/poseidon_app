import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './config/swagger';
import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

 app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  // app.useStaticAssets(join(process.cwd(), 'public'), {
  //   // Optionally set prefix if you want URL like /static/sharif.txt
  //   // prefix: '/static',
  // });

  SwaggerSetting(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
