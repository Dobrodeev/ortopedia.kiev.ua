import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content/content.service';
import { Category } from './database/entities/category.entity';
import { Faq } from './database/entities/faq.entity';
import { PriceItem } from './database/entities/price-item.entity';
import { Service } from './database/entities/service.entity';
import { Setting } from './database/entities/setting.entity';
import { SeedService } from './database/seed.service';
import { PagesController } from './pages/pages.controller';
import { PageService } from './pages/page.service';
import { SeoController } from './pages/seo.controller';

const entities = [Service, Faq, Category, PriceItem, Setting];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', '127.0.0.1'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'ortopedia_vip'),
        entities,
        synchronize: config.get('DB_SYNC', 'true') === 'true',
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [PagesController, SeoController],
  providers: [ContentService, SeedService, PageService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seed: SeedService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seed.seedIfEmpty();
  }
}
