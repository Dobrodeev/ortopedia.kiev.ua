/**
 * Прайс-лист. price: null → на сайті показується «Вартість уточнюйте у адміністратора».
 * priceFrom: true → перед ціною виводиться «від».
 * Після зміни виконайте: npm run build && npm run seed
 */
import { categories } from './site';

export interface PriceSeed {
  category: string;
  name: string;
  price: number | null;
  priceFrom?: boolean;
  note?: string;
  serviceSlug?: string;
}

const categoryTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title ?? '';

const CONSULTATION = 'Консультація';
const JOINTS = categoryTitle('sugloby');
const SPINE = categoryTitle('khrebet-i-postava');
const TRAUMA = categoryTitle('travmy-i-sport');
const SPECIAL = categoryTitle('dity-i-spetsialni-metody');

export const prices: PriceSeed[] = [
  {
    category: CONSULTATION,
    name: 'Консультація (з УЗД)',
    price: 1500,
    note: 'Тривалість — 20 хв',
  },
  {
    category: CONSULTATION,
    name: 'Розширена консультація (з УЗД усіх суглобів)',
    price: 3000,
    note: 'Тривалість — 40 хв',
  },
  {
    category: JOINTS,
    name: 'Ін’єкція (блокада) з дипроспаном',
    price: 1500,
    serviceSlug: 'iniektsii-v-sugloby',
  },
  {
    category: JOINTS,
    name: 'PRP-терапія (плазма, збагачена тромбоцитами)',
    price: 2500,
  },
  {
    category: JOINTS,
    name: 'Введення препаратів з колагеном у суглоб',
    price: 2000,
  },
  {
    category: JOINTS,
    name: 'Лікування суглоба (1 процедура)',
    price: 4800,
    priceFrom: true,
  },
  {
    category: JOINTS,
    name: 'Пункція суглоба',
    price: 1000,
    serviceSlug: 'punktsiia-sugloba',
  },
  {
    category: SPINE,
    name: 'Остеопатія',
    price: 2000,
  },
  {
    category: SPECIAL,
    name: 'Ботулінотерапія',
    price: 10000,
    priceFrom: true,
    serviceSlug: 'botulinoterapiia-v-ortopedii',
  },
  {
    category: TRAUMA,
    name: 'Накладання Scotchcast',
    price: 2000,
  },
  {
    category: TRAUMA,
    name: 'Зняття гіпсу',
    price: 600,
  },
];
