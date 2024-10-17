import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3008);

  await NestFactory.createApplicationContext(AppModule, {
    logger: console,
  });
}
bootstrap();
