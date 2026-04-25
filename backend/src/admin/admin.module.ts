import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { DatabaseSeederModule } from '../database-seeder/database-seeder.module';

@Module({
  imports: [DatabaseSeederModule],
  controllers: [AdminController],
})
export class AdminModule {}
