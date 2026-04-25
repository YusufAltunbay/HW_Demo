import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database-seeder.service';
import { Book } from '../books/book.entity';
import { Metric } from '../metrics/metric.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Metric, User])],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
