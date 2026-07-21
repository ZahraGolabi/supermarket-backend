// import { morganFormat, morganOptions } from '@config/morgan.config';
// import { initSwagger } from '@config/swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { HttpExceptionFilter } from '@shared/filters/exception.filter';
import dataSource from '@config/data-source';
import { initSwagger } from '@config/swagger.config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  await dataSource.initialize();

  if (process.env.NODE_ENV == 'development') initSwagger(app);

  // app.use(morgan(morganFormat, morganOptions));

  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001, async () => {
    Logger.log(`Server run on port :  ${process.env.PORT}`, 'AppLogger');
    Logger.log(`docs on :  ${await app.getUrl()}/docs`, 'AppLogger');
  });
}
bootstrap();
