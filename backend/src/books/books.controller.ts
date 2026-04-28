import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Post()
  create(@Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Post(':id/buy')
  buy(@Param('id') id: string): Promise<void> {
    return this.booksService.buy(+id);
  }

  @Post('checkout')
  async checkout(@Body() items: { id: number, quantity: number }[]): Promise<{ status: string }> {
    try {
      await this.booksService.checkout(items);
      return { status: 'success' };
    } catch (e) {
      throw new Error(e.message);
    }
  }
  
  @Post(':id/restock')
  restock(@Param('id') id: string): Promise<void> {
    return this.booksService.restock(+id);
  }
}
