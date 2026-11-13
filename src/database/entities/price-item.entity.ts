import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('price_items')
export class PriceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', length: 120 })
  category: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  /** Ціна в гривнях; null — «Вартість уточнюйте у адміністратора» */
  @Column({ type: 'int', nullable: true })
  price: number | null;

  @Column({ type: 'varchar', length: 240, nullable: true })
  note: string | null;

  /** Пов’язана сторінка послуги (необов’язково) */
  @Column({ type: 'varchar', length: 80, nullable: true })
  serviceSlug: string | null;
}
