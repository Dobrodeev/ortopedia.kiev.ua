import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { Faq } from './entities/faq.entity';
import { PriceItem } from './entities/price-item.entity';
import { Service } from './entities/service.entity';
import { Setting } from './entities/setting.entity';
import { prices } from './seed-data/prices';
import { services } from './seed-data/services';
import { categories, home, promo, site } from './seed-data/site';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /** Наповнює порожню базу під час першого запуску */
  async seedIfEmpty(): Promise<void> {
    const count = await this.dataSource.getRepository(Service).count();
    if (count === 0) {
      await this.seed();
    }
  }

  /** Повністю перезаписує контент у базі даними з src/database/seed-data */
  async seed(): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      await em.createQueryBuilder().delete().from(Faq).execute();
      await em.createQueryBuilder().delete().from(PriceItem).execute();
      await em.createQueryBuilder().delete().from(Service).execute();
      await em.createQueryBuilder().delete().from(Category).execute();
      await em.createQueryBuilder().delete().from(Setting).execute();

      await em.save(Setting, [
        { key: 'site', value: site },
        { key: 'promo', value: promo },
        { key: 'home', value: home },
      ]);
      await em.save(Category, categories);

      for (const [index, { faqs, disclaimer, ...rest }] of services.entries()) {
        await em.save(Service, { ...rest, disclaimer: disclaimer ?? null, sortOrder: index + 1 });
        await em.save(
          Faq,
          faqs.map((f, i) => ({ ...f, serviceSlug: rest.slug, sortOrder: i + 1 })),
        );
      }

      await em.save(
        PriceItem,
        prices.map((p, i) => ({
          ...p,
          note: p.note ?? null,
          serviceSlug: p.serviceSlug ?? null,
          sortOrder: i + 1,
        })),
      );
    });
    this.logger.log(`Базу наповнено: послуг — ${services.length}, позицій прайсу — ${prices.length}`);
  }
}
