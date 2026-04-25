import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column()
  author: string;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: 5 })
  stock: number;
}
