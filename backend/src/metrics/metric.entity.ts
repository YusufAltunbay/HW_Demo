import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: string;

  @Column('decimal')
  value: number;

  @Column()
  type: string; // 'revenue' or 'sales' or 'junk'
}
