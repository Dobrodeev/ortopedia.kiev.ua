// Готує статичні ресурси у public/: шрифти, іконки, DataTables, оптимізовані фото.
// Запуск: npm run assets
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve, parse } from 'node:path';
import sharp from 'sharp';

const root = resolve(import.meta.dirname, '..');
const nm = (...p) => join(root, 'node_modules', ...p);
const pub = (...p) => join(root, 'public', ...p);
const ensure = (dir) => mkdirSync(dir, { recursive: true });

// ---------- 1. Вендорні скрипти та стилі ----------
ensure(pub('vendor'));
const copies = [
  ['jquery/dist/jquery.min.js', 'jquery.min.js'],
  ['datatables.net/js/dataTables.min.js', 'dataTables.min.js'],
  ['datatables.net-dt/css/dataTables.dataTables.min.css', 'dataTables.dataTables.min.css'],
  ['datatables.net-responsive/js/dataTables.responsive.min.js', 'dataTables.responsive.min.js'],
  ['datatables.net-responsive-dt/js/responsive.dataTables.min.js', 'responsive.dataTables.min.js'],
  ['datatables.net-responsive-dt/css/responsive.dataTables.min.css', 'responsive.dataTables.min.css'],
];
for (const [from, to] of copies) cpSync(nm(from), pub('vendor', to));

// ---------- 2. Іконковий шрифт Phosphor (лише woff2) ----------
ensure(pub('vendor', 'phosphor'));
cpSync(nm('@phosphor-icons/web/src/regular/Phosphor.woff2'), pub('vendor', 'phosphor', 'Phosphor.woff2'));
const phCss = readFileSync(nm('@phosphor-icons/web/src/regular/style.css'), 'utf8').replace(
  /src:[\s\S]*?;/,
  'src: url("./Phosphor.woff2") format("woff2");',
);
writeFileSync(pub('vendor', 'phosphor', 'phosphor.css'), phCss);

// ---------- 3. Шрифти Manrope та Inter (змінні, кирилиця + латиниця) ----------
ensure(pub('fonts'));
const ranges = {
  cyrillic: 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116',
  'cyrillic-ext': 'U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F',
  latin:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
let fontCss = '';
for (const [pkg, family, weights] of [
  ['manrope', 'Manrope', '200 800'],
  ['inter', 'Inter', '100 900'],
]) {
  for (const [subset, range] of Object.entries(ranges)) {
    const file = `${pkg}-${subset}-wght-normal.woff2`;
    cpSync(nm('@fontsource-variable', pkg, 'files', file), pub('fonts', file));
    fontCss += `@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:${weights};src:url("/fonts/${file}") format("woff2-variations");unicode-range:${range};}\n`;
  }
}
writeFileSync(pub('fonts', 'fonts.css'), fontCss);

// ---------- 4. Фотографії: AVIF + WebP у двох розмірах ----------
const srcDir = join(root, 'assets-src', 'photos');
const outDir = pub('img');
ensure(outDir);
if (existsSync(srcDir)) {
  for (const file of readdirSync(srcDir)) {
    const { name } = parse(file);
    for (const width of [480, 960]) {
      const base = sharp(join(srcDir, file)).rotate().resize({ width, withoutEnlargement: true });
      await base.clone().webp({ quality: 74 }).toFile(join(outDir, `${name}-${width}.webp`));
      await base.clone().avif({ quality: 50 }).toFile(join(outDir, `${name}-${width}.avif`));
    }
  }
}

// ---------- 5. Favicon, apple-touch-icon та Open Graph зображення (PNG) ----------
const brand = { r: 11, g: 79, b: 108 };
async function icon(size, file) {
  let img = sharp({ create: { width: size, height: size, channels: 4, background: { ...brand, alpha: 1 } } });
  try {
    const text = await sharp({
      text: {
        text: `<span foreground="white" font_weight="bold">VIP</span>`,
        font: 'Arial',
        rgba: true,
        width: Math.round(size * 0.72),
        height: Math.round(size * 0.42),
      },
    })
      .png()
      .toBuffer();
    img = img.composite([{ input: text, gravity: 'centre' }]);
  } catch {
    /* без тексту, якщо pango недоступний */
  }
  await img.png().toFile(pub(file));
}
await icon(48, 'favicon.png');
await icon(180, 'apple-touch-icon.png');
await icon(512, 'icon-512.png');

const ogSrc = join(srcDir, 'hero.jpg');
if (existsSync(ogSrc)) {
  await sharp(ogSrc).rotate().resize(1200, 630, { fit: 'cover', position: 'top' }).jpeg({ quality: 80 }).toFile(pub('og-image.jpg'));
}

console.log('Статичні ресурси зібрано у public/');
