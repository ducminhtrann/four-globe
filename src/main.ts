import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = Number(process.env.PORT);
  await app.listen(process.env.PORT ?? 3000, () => Logger.log(`SERVICE IS RUNNING ON PORT: ${PORT}`));
}
bootstrap();
