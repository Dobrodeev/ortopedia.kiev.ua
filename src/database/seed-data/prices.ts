/**
 * Прайс-лист. price: null → на сайті показується «Вартість уточнюйте у адміністратора».
 * Після зміни виконайте: npm run build && npm run seed
 */
import { services } from './services';
import { categories } from './site';

export interface PriceSeed {
  category: string;
  name: string;
  price: number | null;
  note?: string;
  serviceSlug?: string;
}

const categoryTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title ?? '';

export const prices: PriceSeed[] = [
  {
    category: 'Консультація',
    name: 'Консультація ортопеда-травматолога',
    price: null,
  },
  ...services.map((s) => ({
    category: categoryTitle(s.categorySlug),
    name: s.title,
    price: null,
    serviceSlug: s.slug,
  })),
];
