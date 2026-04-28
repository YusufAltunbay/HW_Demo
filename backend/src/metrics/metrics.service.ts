import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metric } from './metric.entity';

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private metricsRepository: Repository<Metric>,
  ) {}

  async findAll(): Promise<any[]> {
    const metrics = await this.metricsRepository.find({
      order: {
        id: 'ASC',
      },
    });

    const aggregated = metrics.reduce((acc, m) => {
      const key = m.periodKey || m.label || m.month;

      if (!acc[key]) {
        acc[key] = {
          ...m,
          value: Number(m.value),
          label: m.label || m.periodKey || m.month,
        };
      } else {
        acc[key].value += Number(m.value);
        if (m.isTest) {
          acc[key].isTest = true;
          acc[key].type = m.type;
        }
      }
      return acc;
    }, {});

    const currentDate = new Date();
    const activeMonths = Array.from({ length: 12 }, (_, index) => {
      const offset = 11 - index;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);
      const monthName = Object.keys(MONTH_INDEX).find((name) => MONTH_INDEX[name] === date.getMonth()) || date.toLocaleString('en-US', { month: 'short' });
      const periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleString('tr-TR', { month: 'short', year: 'numeric' });

      return aggregated[periodKey]
        || aggregated[label]
        || aggregated[monthName]
        || { month: monthName, periodKey, label, value: 0, type: 'revenue', isTest: false };
    });

    return activeMonths;
  }
}
