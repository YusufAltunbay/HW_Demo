import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metric } from './metric.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private metricsRepository: Repository<Metric>,
  ) {}

  async findAll(): Promise<any[]> {
    const metrics = await this.metricsRepository.find();
    
    const aggregated = metrics.reduce((acc, m) => {
      if (!acc[m.month]) {
        acc[m.month] = { ...m, value: Number(m.value) };
      } else {
        acc[m.month].value += Number(m.value);
        if (m.isTest) acc[m.month].isTest = true;
      }
      return acc;
    }, {});

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();
    const activeMonths = [];
    for (let i = 11; i >= 0; i--) {
      let index = currentMonthIndex - i;
      if (index < 0) index += 12;
      activeMonths.push(months[index]);
    }
    
    return activeMonths.map(month => aggregated[month] || { month, value: 0, type: 'revenue', isTest: false });
  }
}
