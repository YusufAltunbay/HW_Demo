import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Metric } from './metric.entity';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  findAll(): Promise<Metric[]> {
    return this.metricsService.findAll();
  }
}
