// Статичний експорт сайту для Firebase Hosting.
// Запускає зібраний Nest.js-застосунок, обходить усі сторінки із sitemap.xml
// і зберігає готовий HTML разом зі статикою у firebase-dist/.
// Запуск: npm run export (потрібні `npm run build`, `npm run assets` і запущена база)
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'firebase-dist');
const port = process.env.EXPORT_PORT || '3187';
const origin = `http://127.0.0.1:${port}`;

if (!existsSync(join(root, 'dist', 'main.js'))) {
  console.error('Немає dist/main.js — спочатку виконайте `npm run build`.');
  process.exit(1);
}
if (!existsSync(join(root, 'public', 'img'))) {
  console.error('Немає public/img — спочатку виконайте `npm run assets`.');
  process.exit(1);
}

// SITE_URL потрапляє в canonical, sitemap і JSON-LD — беремо з .env
const envFile = join(root, '.env');
const siteUrl = (
  process.env.SITE_URL ||
  (existsSync(envFile) ? readFileSync(envFile, 'utf8').match(/^SITE_URL=(.+)$/m)?.[1] : '') ||
  ''
)
  .trim()
  .replace(/\/+$/, '');
if (!siteUrl || siteUrl.includes('localhost')) {
  console.error('Вкажіть у .env бойову адресу сайту: SITE_URL=https://ваш-домен');
  process.exit(1);
}

const server = spawn(process.execPath, ['dist/main.js'], {
  cwd: root,
  env: { ...process.env, PORT: port, NODE_ENV: 'production' },
  stdio: ['ignore', 'ignore', 'inherit'],
});
const stop = () => server.kill();
process.on('exit', stop);

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error('Сервер не запустився (перевірте, чи працює база: npm run db:start)');
    try {
      const res = await fetch(`${origin}/robots.txt`);
      if (res.ok) return;
    } catch {
      /* ще не слухає порт */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Сервер не відповів за 30 секунд');
}

function save(relPath, content) {
  const file = join(outDir, relPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

try {
  await waitForServer();

  rmSync(outDir, { recursive: true, force: true });
  cpSync(join(root, 'public'), outDir, { recursive: true });

  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  if (!paths.length) throw new Error('sitemap.xml порожній');

  for (const path of paths) {
    const res = await fetch(origin + path);
    if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
    // «/» → index.html, «/pro-nas» → pro-nas.html (Firebase cleanUrls віддає його за адресою /pro-nas)
    save(path === '/' ? 'index.html' : `${path.slice(1)}.html`, await res.text());
  }

  const notFound = await fetch(`${origin}/__404__`);
  save('404.html', await notFound.text());
  save('sitemap.xml', sitemap);
  save('robots.txt', await (await fetch(`${origin}/robots.txt`)).text());

  console.log(`Експортовано сторінок: ${paths.length} (+404) → firebase-dist/, адреса сайту: ${siteUrl}`);
} catch (err) {
  console.error('Помилка експорту:', err.message);
  process.exitCode = 1;
} finally {
  stop();
}
