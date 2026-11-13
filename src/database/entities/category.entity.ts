import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Напрям лікування — групує послуги у mega-menu та каталозі */
@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  slug: string;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'varchar', length: 240 })
  description: string;

  @Column({ type: 'varchar', length: 60 })
  icon: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
