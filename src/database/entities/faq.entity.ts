import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('faqs')
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Service, (service) => service.faqs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceSlug' })
  service: Service;

  @Column({ type: 'varchar', length: 80 })
  serviceSlug: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;
}
