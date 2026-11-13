import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { NotFoundFilter } from './common/not-found.filter';
import { registerViewHelpers } from './common/view-helpers';
import { PageService } from './pages/page.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const root = join(__dirname, '..');

  app.use(compression());
  app.useStaticAssets(join(root, 'public'), { maxAge: '7d' });
  app.setBaseViewsDir(join(root, 'views'));
  app.setViewEngine('hbs');
  app.set('view options', { layout: 'layout' });
  await registerViewHelpers(join(root, 'views', 'partials'));

  app.useGlobalFilters(new NotFoundFilter(app.get(PageService)));
  app.disable('x-powered-by');

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Сайт запущено: http://localhost:${port}`);
}

bootstrap();
