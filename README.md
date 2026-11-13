# Ортопедія VIP — сайт медичного центру

Багатосторінковий SEO-сайт українською мовою. Стек: **Nest.js 11 + TypeScript**, **PostgreSQL** (TypeORM), серверний рендеринг шаблонів Handlebars, прайс-лист на **DataTables.js**.

## Запуск

```bash
npm install
npm run assets      # шрифти, іконки, DataTables, фото AVIF/WebP → public/
npm run db:init     # перший раз: окремий локальний кластер PostgreSQL на порту 5440 (.pgdata/)
npm run build
npm start           # http://localhost:3000
```

Наступні запуски: `npm run db:start` → `npm start`. Зупинити базу: `npm run db:stop`.

Замість локального кластера можна взяти Docker (`docker compose up -d`, пароль `ortopedia` вписати в `.env`)
або будь-який наявний PostgreSQL — параметри підключення в `.env` (зразок: `.env.example`).

Під час першого запуску таблиці створюються автоматично (`DB_SYNC=true`), а порожня база наповнюється контентом.

## Де змінювати контент

Увесь контент лежить у `src/database/seed-data/` і зберігається в PostgreSQL:

| Файл | Що містить |
| --- | --- |
| `site.ts` | контакти, посилання на запис і карту, соцмережі, акція, тексти головної, напрями |
| `services.ts` | 13 послуг: картка, сторінка, показання, етапи прийому, FAQ, SEO-метадані |
| `prices.ts` | прайс-лист (`price: null` → «Вартість уточнюйте у адміністратора») |

Після змін: `npm run build && npm run seed` (перезаписує контент у базі) і перезапустити сервер.

Акцію можна вимкнути одним прапорцем: `promo.enabled = false` у `site.ts`.

## Сторінки

| Адреса | Сторінка |
| --- | --- |
| `/` | Головна |
| `/pro-nas` | Про нас |
| `/poslugy` | Каталог послуг |
| `/poslugy/:slug` | Сторінка послуги (13 шт.) |
| `/tsiny` | Ціни |
| `/kontakty` | Контакти |
| `/polityka-konfidentsiinosti` | Політика конфіденційності |
| `/robots.txt`, `/sitemap.xml` | генеруються автоматично |

Домен для canonical, sitemap, Open Graph і JSON-LD задається змінною `SITE_URL` у `.env`.

## Структура

```
src/
  database/entities/    сутності: Service, Faq, Category, PriceItem, Setting
  database/seed-data/   контент (єдине джерело)
  content/              читання контенту з БД із коротким кешем
  pages/                контролери сторінок, SEO-маршрути, спільні дані шаблонів
views/                  layout, partials, pages (Handlebars)
public/                 css, js + зібрані шрифти, іконки, фото
assets-src/photos/      вихідні фотографії (ім’я файлу = ім’я зображення в контенті)
scripts/                збирання статики, локальна база
```

Нова фотографія: покласти файл у `assets-src/photos/`, виконати `npm run assets`, вказати ім’я без розширення в полі `image` послуги.
