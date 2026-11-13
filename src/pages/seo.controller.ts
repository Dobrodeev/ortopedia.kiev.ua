import { Controller, Get, Header } from '@nestjs/common';
import { ContentService } from '../content/content.service';
import { PageService } from './page.service';

@Controller()
export class SeoController {
  constructor(
    private readonly pages: PageService,
    private readonly content: ContentService,
  ) {}

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  robots(): string {
    return `User-agent: *\nAllow: /\n\nSitemap: ${this.pages.siteUrl}/sitemap.xml\n`;
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async sitemap(): Promise<string> {
    const { services } = await this.content.load();
    const entries: [string, string][] = [
      ['/', '1.0'],
      ['/poslugy', '0.9'],
      ...services.map((s): [string, string] => [`/poslugy/${s.slug}`, '0.8']),
      ['/tsiny', '0.7'],
      ['/pro-nas', '0.6'],
      ['/kontakty', '0.6'],
      ['/polityka-konfidentsiinosti', '0.2'],
    ];
    const urls = entries
      .map(([path, priority]) => `  <url><loc>${this.pages.siteUrl}${path}</loc><priority>${priority}</priority></url>`)
      .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  }
}
