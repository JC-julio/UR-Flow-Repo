import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/infra/http/nest/app.module';

async function main(port: number) {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: true });
  await app.listen(port);
}
const port = 4000;
main(port);
