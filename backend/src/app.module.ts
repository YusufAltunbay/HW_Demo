import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeederService } from './database-seeder/database-seeder.service';
import { BooksModule } from './books/books.module';
import { MetricsModule } from './metrics/metrics.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseSeederModule } from './database-seeder/database-seeder.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Book } from './books/book.entity';
import { Metric } from './metrics/metric.entity';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Book, Metric, User],
      synchronize: true, // Auto create tables for demo
    }),
    BooksModule,
    MetricsModule,
    AdminModule,
    DatabaseSeederModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor(private readonly seederService: DatabaseSeederService) {}
}
