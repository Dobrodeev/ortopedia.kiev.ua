import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { PriceItem } from '../database/entities/price-item.entity';
import { Service } from '../database/entities/service.entity';
import { Setting } from '../database/entities/setting.entity';

export interface CategoryWithServices extends Category {
  services: Service[];
}

export interface SiteContent {
  site: Record<string, any>;
  promo: Record<string, any>;
  home: Record<string, any>;
  services: Service[];
  categories: CategoryWithServices[];
  prices: PriceItem[];
}

/** Читає весь контент із PostgreSQL і коротко кешує його в пам’яті */
@Injectable()
export class ContentService {
  private cache: { at: number; data: SiteContent } | null = null;
  private readonly ttlMs = 30_000;

  constructor(
    @InjectRepository(Service) private readonly services: Repository<Service>,
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(PriceItem) private readonly prices: Repository<PriceItem>,
    @InjectRepository(Setting) private readonly settings: Repository<Setting>,
  ) {}

  invalidate(): void {
    this.cache = null;
  }

  async load(): Promise<SiteContent> {
    if (this.cache && Date.now() - this.cache.at < this.ttlMs) {
      return this.cache.data;
    }
    const [services, categories, prices, settings] = await Promise.all([
      this.services.find({ order: { sortOrder: 'ASC', faqs: { sortOrder: 'ASC' } }, relations: { faqs: true } }),
      this.categories.find({ order: { sortOrder: 'ASC' } }),
      this.prices.find({ order: { sortOrder: 'ASC' } }),
      this.settings.find(),
    ]);
    const setting = (key: string) => (settings.find((s) => s.key === key)?.value ?? {}) as Record<string, any>;
    const data: SiteContent = {
      site: setting('site'),
      promo: setting('promo'),
      home: setting('home'),
      services,
      categories: categories.map((c) => ({
        ...c,
        services: services.filter((s) => s.categorySlug === c.slug),
      })),
      prices,
    };
    this.cache = { at: Date.now(), data };
    return data;
  }
}
