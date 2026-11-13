import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Довільні налаштування сайту у форматі ключ → JSON (контакти, акція, тексти головної) */
@Entity('settings')
export class Setting {
  @PrimaryColumn({ type: 'varchar', length: 60 })
  key: string;

  @Column({ type: 'jsonb' })
  value: unknown;
}
