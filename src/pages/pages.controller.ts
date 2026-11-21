import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ContentService } from '../content/content.service';
import { PageService } from './page.service';

@Controller()
export class PagesController {
  constructor(
    private readonly pages: PageService,
    private readonly content: ContentService,
  ) {}

  @Get()
  async home(@Res() res: Response) {
    res.render(
      'pages/home',
      await this.pages.locals({
        path: '/',
        nav: 'home',
        title: 'Ортопед-травматолог у Києві — біль у спині та суглобах',
        description:
          'Ортопед-травматолог Величко В. М. у Києві: лікування болю в спині, шиї та суглобах для дорослих і дітей від 5 років. Консультація, УЗД і лікування за один візит.',
      }),
    );
  }

  @Get('pro-nas')
  async about(@Res() res: Response) {
    res.render(
      'pages/about',
      await this.pages.locals({
        path: '/pro-nas',
        nav: 'about',
        title: 'Про центр «Ортопедія VIP» — ортопед-травматолог у Києві',
        description:
          'Медичний центр «Ортопедія VIP» у Києві: ортопедія, травматологія, лікування болю та відновлення руху для дорослих і дітей від 5 років. Діагностика й початок лікування на першому візиті.',
        breadcrumbs: [{ name: 'Про нас', path: '/pro-nas' }],
      }),
    );
  }

  @Get('poslugy')
  async services(@Res() res: Response) {
    res.render(
      'pages/services',
      await this.pages.locals({
        path: '/poslugy',
        nav: 'services',
        title: 'Послуги ортопеда-травматолога у Києві | Ортопедія VIP',
        description:
          'Послуги медичного центру «Ортопедія VIP» у Києві: ін’єкції в суглоби під УЗД, лікування болю в спині та шиї, травматологія, корекція постави, дитяча ортопедія.',
        breadcrumbs: [{ name: 'Послуги', path: '/poslugy' }],
      }),
    );
  }

  @Get('poslugy/:slug')
  async service(@Param('slug') slug: string, @Res() res: Response) {
    const data = await this.content.load();
    const service = data.services.find((s) => s.slug === slug);
    if (!service) throw new NotFoundException();

    const category = data.categories.find((c) => c.slug === service.categorySlug);
    const sameCategory = data.services.filter((s) => s.slug !== slug && s.categorySlug === service.categorySlug);
    const rest = data.services.filter((s) => s.slug !== slug && s.categorySlug !== service.categorySlug);
    const others = [...sameCategory, ...rest].slice(0, 3);
    const path = `/poslugy/${slug}`;

    res.render(
      'pages/service',
      await this.pages.locals(
        {
          path,
          nav: 'services',
          title: service.metaTitle,
          description: service.metaDescription,
          ogImage: `/img/${service.image}-960.webp`,
          breadcrumbs: [
            { name: 'Послуги', path: '/poslugy' },
            { name: service.menuTitle, path },
          ],
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'MedicalWebPage',
              name: service.h1,
              description: service.metaDescription,
              url: this.pages.siteUrl + path,
              inLanguage: 'uk',
              about: { '@type': 'MedicalTherapy', name: service.title },
              publisher: { '@id': this.pages.siteUrl + '/#clinic' },
              reviewedBy: { '@id': this.pages.physicianId },
              lastReviewed: data.site.lastReviewed,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: service.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            },
          ],
        },
        { service, category, others },
      ),
    );
  }

  @Get('tsiny')
  async prices(@Res() res: Response) {
    res.render(
      'pages/prices',
      await this.pages.locals(
        {
          path: '/tsiny',
          nav: 'prices',
          title: 'Ціни на послуги ортопеда у Києві | Ортопедія VIP',
          description:
            'Ціни «Ортопедія VIP» у Києві: консультація ортопеда-травматолога з УЗД — від 1500 грн, лікування суглобів і хребта, травматологія. Запис: +38 063 441 90 75.',
          breadcrumbs: [{ name: 'Ціни', path: '/tsiny' }],
        },
        { usesDataTables: true },
      ),
    );
  }

  @Get('kontakty')
  async contacts(@Res() res: Response) {
    res.render(
      'pages/contacts',
      await this.pages.locals({
        path: '/kontakty',
        nav: 'contacts',
        title: 'Контакти Ортопедія VIP — Київ, вул. Бойчука 1/2',
        description:
          'Адреса та телефон медичного центру «Ортопедія VIP»: м. Київ, вул. Михайла Бойчука 1/2, м. Звіринецька. Телефон: +38 063 441 90 75. Онлайн-запис на консультацію.',
        breadcrumbs: [{ name: 'Контакти', path: '/kontakty' }],
      }),
    );
  }

  @Get('polityka-konfidentsiinosti')
  async privacy(@Res() res: Response) {
    res.render(
      'pages/privacy',
      await this.pages.locals({
        path: '/polityka-konfidentsiinosti',
        title: 'Політика конфіденційності — Ортопедія VIP',
        description: 'Політика конфіденційності сайту медичного центру «Ортопедія VIP».',
        breadcrumbs: [{ name: 'Політика конфіденційності', path: '/polityka-konfidentsiinosti' }],
      }),
    );
  }
}
