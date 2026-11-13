import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.get(SeedService).seed();
  await app.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
