import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Metric } from '../metrics/metric.entity';

const getCurrentPeriod = () => {
  const currentDate = new Date();
  return {
    month: currentDate.toLocaleString('en-US', { month: 'short' }),
    periodKey: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
  };
};

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Metric)
    private metricsRepository: Repository<Metric>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  create(bookData: Partial<Book>): Promise<Book> {
    const book = this.booksRepository.create({
      ...bookData,
      coverImage: bookData.coverImage || 'https://via.placeholder.com/60x90/ccc/fff?text=New',
    });
    return this.booksRepository.save(book);
  }

  async buy(id: number): Promise<void> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (book && book.stock > 0) {
      book.stock -= 1;
      await this.booksRepository.save(book);

      const currentPeriod = getCurrentPeriod();
      const metric = await this.metricsRepository.findOne({ where: { periodKey: currentPeriod.periodKey } });
      if (metric) {
        metric.value += book.price;
        await this.metricsRepository.save(metric);
      } else {
        const firstMetric = await this.metricsRepository.findOne({ where: { month: currentPeriod.month } });
        if (firstMetric) {
           firstMetric.value += book.price;
           await this.metricsRepository.save(firstMetric);
        }
      }
    }
  }

  async checkout(items: { id: number, quantity: number }[]): Promise<void> {
    let totalValue = 0;
    const booksToSave: Book[] = [];

    // Check stock for all items
    for (const item of items) {
      const book = await this.booksRepository.findOne({ where: { id: item.id } });
      if (!book) throw new Error(`Book ${item.id} not found`);
      if (book.stock < item.quantity) throw new Error(`Not enough stock for book ${book.title}`);
      
      book.stock -= item.quantity;
      totalValue += book.price * item.quantity;
      booksToSave.push(book);
    }

    // Save all books
    await this.booksRepository.save(booksToSave);

    // Update metrics
    if (totalValue > 0) {
      const currentPeriod = getCurrentPeriod();
      const metric = await this.metricsRepository.findOne({ where: { periodKey: currentPeriod.periodKey } });
      if (metric) {
        metric.value = Number(metric.value) + totalValue;
        await this.metricsRepository.save(metric);
      } else {
        const firstMetric = await this.metricsRepository.findOne({ where: { month: currentPeriod.month } });
        if (firstMetric) {
           firstMetric.value = Number(firstMetric.value) + totalValue;
           await this.metricsRepository.save(firstMetric);
        }
      }
    }
  }

  async restock(id: number): Promise<void> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (book) {
      book.stock += 5;
      await this.booksRepository.save(book);
    }
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }
}
