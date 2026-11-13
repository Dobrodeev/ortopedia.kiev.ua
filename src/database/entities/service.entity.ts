import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Faq } from './faq.entity';

export interface ServiceStep {
  title: string;
  text: string;
}

@Entity('services')
export class Service {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  slug: string;

  @Column({ type: 'varchar', length: 80 })
  categorySlug: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  /** Назва для карток та меню */
  @Column({ type: 'varchar', length: 160 })
  title: string;

  /** Коротка назва для mega-menu та футера */
  @Column({ type: 'varchar', length: 80 })
  menuTitle: string;

  /** H1 сторінки послуги */
  @Column({ type: 'varchar', length: 200 })
  h1: string;

  /** Короткий опис для картки */
  @Column({ type: 'text' })
  summary: string;

  /** Вступ на сторінці послуги */
  @Column({ type: 'text' })
  lead: string;

  /** Опис проблеми */
  @Column({ type: 'text' })
  problem: string;

  /** Кому підходить */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  audience: string[];

  /** Як проходить прийом / процедура */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  steps: ServiceStep[];

  /** Які стани лікуємо */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  conditions: string[];

  /** Переваги підходу */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  benefits: string[];

  @Column({ type: 'text', nullable: true })
  disclaimer: string | null;

  /** Клас іконки Phosphor, напр. "ph-syringe" */
  @Column({ type: 'varchar', length: 60 })
  icon: string;

  /** Базове ім’я файлу у public/img (без розміру та розширення) */
  @Column({ type: 'varchar', length: 80 })
  image: string;

  @Column({ type: 'varchar', length: 200 })
  imageAlt: string;

  @Column({ type: 'varchar', length: 200 })
  metaTitle: string;

  @Column({ type: 'varchar', length: 320 })
  metaDescription: string;

  @OneToMany(() => Faq, (faq) => faq.service, { cascade: true })
  faqs: Faq[];
}
