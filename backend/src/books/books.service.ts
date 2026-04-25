import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
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
    }
  }
}
