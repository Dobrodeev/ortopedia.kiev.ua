import hbs from 'hbs';

/** Реєструє partials і допоміжні функції шаблонів Handlebars */
export function registerViewHelpers(partialsDir: string): Promise<void> {
  hbs.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  hbs.registerHelper('pad2', (n: number) => String(Number(n) + 1).padStart(2, '0'));
  /** Безпечний вивід JSON усередині <script type="application/ld+json"> */
  hbs.registerHelper(
    'json',
    (value: unknown) => new hbs.handlebars.SafeString(JSON.stringify(value).replace(/</g, '\\u003c')),
  );
  hbs.registerHelper('uah', (value: number | null) =>
    value == null ? '' : `${new Intl.NumberFormat('uk-UA').format(value)} грн`,
  );
  return new Promise((resolve) => hbs.registerPartials(partialsDir, () => resolve()));
}
