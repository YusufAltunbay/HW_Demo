import { Controller, Post } from '@nestjs/common';
import { DatabaseSeederService } from '../database-seeder/database-seeder.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly seederService: DatabaseSeederService) {}

  @Post('reset')
  async resetToGoldenState() {
    await this.seederService.seedGoldenState();
    return { status: 'success', message: 'Restored to Golden State' };
  }

  @Post('junk')
  async resetToJunkState() {
    await this.seederService.seedJunkState();
    return { status: 'success', message: 'Loaded Junk Data' };
  }
}
