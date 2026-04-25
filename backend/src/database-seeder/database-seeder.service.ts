import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/book.entity';
import { Metric } from '../metrics/metric.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DatabaseSeederService {
  constructor(
    @InjectRepository(Book) private bookRepo: Repository<Book>,
    @InjectRepository(Metric) private metricRepo: Repository<Metric>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async seedGoldenState() {
    await this.bookRepo.clear();
    await this.metricRepo.clear();
    await this.userRepo.clear();
  }

  async seedJunkState() {
    await this.bookRepo.clear();
    await this.metricRepo.clear();
    await this.userRepo.clear();

    const randomStr = (len) => Math.random().toString(36).substring(2, 2 + len);
    const randomPrice = () => parseFloat((Math.random() * 1000).toFixed(2));

    const books = Array.from({ length: 5 }).map(() => ({
      title: `Test_Title_${randomStr(5)}`,
      subtitle: `Subtitle_${randomStr(3)}`,
      author: `User_${randomStr(4)}`,
      price: randomPrice(),
      coverImage: 'https://s3.amazonaws.com/clarityfm-production/attachments/16430/default/VisionDB-Demo-button.jpg?1497260357',
      stock: Math.floor(Math.random() * 5) + 1, // Random stock between 1-5
    }));

    await this.bookRepo.save(books);

    const matchMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const metrics = matchMonths.map((m) => ({
      month: m,
      value: Math.floor(Math.random() * 400),
      type: 'sales',
    }));

    await this.metricRepo.save(metrics);

    const users = Array.from({ length: 3 }).map(() => ({
      username: `RandomAuthor_${randomStr(4)}`,
      email: `${randomStr(4)}@test.com`,
      role: 'author'
    }));

    await this.userRepo.save(users);
  }
}
