import { NestFactory } from '@nestjs/core';
import { configDotenv } from 'dotenv';
import { AppModule } from './modules/app.module';

configDotenv();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
