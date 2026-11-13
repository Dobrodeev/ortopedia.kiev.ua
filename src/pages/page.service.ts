import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContentService, SiteContent } from '../content/content.service';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  nav?: 'home' | 'about' | 'services' | 'prices' | 'contacts';
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: { name: string; path: string }[];
  jsonLd?: object[];
}

/** Збирає спільні дані для всіх шаблонів: контакти, меню, SEO-метадані, JSON-LD */
@Injectable()
export class PageService {
  /** Версія статики для скидання кешу браузера після оновлення сайту */
  private readonly assetVersion = Date.now().toString(36);

  constructor(
    private readonly content: ContentService,
    private readonly config: ConfigService,
  ) {}

  get siteUrl(): string {
    return String(this.config.get('SITE_URL', 'http://localhost:3000')).replace(/\/+$/, '');
  }

  async locals(meta: PageMeta, extra: Record<string, unknown> = {}) {
    const data = await this.content.load();
    const url = this.siteUrl + meta.path;
    const breadcrumbs = meta.breadcrumbs?.length ? [{ name: 'Головна', path: '/' }, ...meta.breadcrumbs] : null;

    const jsonLd: object[] = [this.clinicSchema(data), ...(meta.jsonLd ?? [])];
    if (breadcrumbs) {
      jsonLd.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: this.siteUrl + b.path,
        })),
      });
    }

    return {
      ...data,
      meta: {
        title: meta.title,
        description: meta.description,
        canonical: url,
        ogImage: this.siteUrl + (meta.ogImage ?? '/og-image.jpg'),
        noindex: meta.noindex ?? false,
      },
      nav: meta.nav ?? null,
      breadcrumbs,
      jsonLd,
      socials: (data.site.socials ?? []).filter((s: { url: string }) => s.url),
      year: 2026,
      v: this.assetVersion,
      ...extra,
    };
  }

  private clinicSchema(data: SiteContent): object {
    const { site } = data;
    return {
      '@context': 'https://schema.org',
      '@type': ['MedicalClinic', 'LocalBusiness'],
      '@id': this.siteUrl + '/#clinic',
      name: site.name,
      description: site.description,
      url: this.siteUrl + '/',
      image: this.siteUrl + '/og-image.jpg',
      telephone: site.phoneE164,
      email: site.email,
      medicalSpecialty: 'Orthopedic',
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.streetAddress,
        addressLocality: site.city,
        addressCountry: 'UA',
      },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo?.lat, longitude: site.geo?.lng },
      hasMap: site.mapsPlaceUrl,
      areaServed: [
        { '@type': 'City', name: 'Київ' },
        { '@type': 'AdministrativeArea', name: 'Київська область' },
      ],
      sameAs: (site.socials ?? []).map((s: { url: string }) => s.url).filter(Boolean),
      availableService: data.services.map((s) => ({
        '@type': 'MedicalTherapy',
        name: s.title,
        url: `${this.siteUrl}/poslugy/${s.slug}`,
      })),
    };
  }
}
