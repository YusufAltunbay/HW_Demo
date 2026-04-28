import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/book.entity';
import { Metric } from '../metrics/metric.entity';
import { User } from '../users/user.entity';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type RollingMonth = {
  month: string;
  periodKey: string;
  label: string;
};

const buildRollingMonths = (count: number) => {
  const currentDate = new Date();
  const months: RollingMonth[] = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);
    const monthIndex = date.getMonth();

    months.push({
      month: MONTH_LABELS[monthIndex],
      periodKey: `${date.getFullYear()}-${String(monthIndex + 1).padStart(2, '0')}`,
      label: date.toLocaleString('tr-TR', { month: 'short', year: 'numeric' }),
    });
  }

  return months;
};

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

    const metrics = buildRollingMonths(12).map((period: RollingMonth) => ({
      month: period.month,
      periodKey: period.periodKey,
      label: period.label,
      value: 0,
      type: 'revenue',
    }));

    await this.metricRepo.save(metrics);
  }

  async clearTestData() {
    await this.bookRepo.delete({ isTest: true });
    await this.metricRepo.delete({ isTest: true });
    await this.userRepo.delete({ isTest: true });
  }

  async seedJunkState() {
    await this.clearTestData();

    const randomStr = (len) => Math.random().toString(36).substring(2, 2 + len);
    const randomPrice = () => Math.floor(Math.random() * 990) + 10;

    const books = Array.from({ length: 5 }).map(() => ({
      title: `Test_Title_${randomStr(5)}`,
      subtitle: `Subtitle_${randomStr(3)}`,
      author: `User_${randomStr(4)}`,
      price: randomPrice(),
      coverImage: 'https://s3.amazonaws.com/clarityfm-production/attachments/16430/default/VisionDB-Demo-button.jpg?1497260357',
      stock: Math.floor(Math.random() * 5) + 1,
      isTest: true,
    }));

    await this.bookRepo.save(books);

    const metrics = buildRollingMonths(12).map((period: RollingMonth) => ({
      month: period.month,
      periodKey: period.periodKey,
      label: period.label,
      value: Math.floor(Math.random() * 400),
      type: 'sales',
      isTest: true,
    }));

    await this.metricRepo.save(metrics);

    const users = Array.from({ length: 3 }).map(() => ({
      username: `RandomAuthor_${randomStr(4)}`,
      email: `${randomStr(4)}@test.com`,
      role: 'author',
      isTest: true,
    }));

    await this.userRepo.save(users);
  }
}
