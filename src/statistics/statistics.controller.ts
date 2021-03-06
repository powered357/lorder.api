import { CacheInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StatisticsResponse } from './dto';
import { StatisticsService } from './statistics.service';

@ApiBearerAuth()
@ApiTags('statistics')
@Controller('statistics')
@UseInterceptors(CacheInterceptor)
export class StatisticsController {
  constructor(private readonly taskService: StatisticsService) {}

  @Get()
  @ApiResponse({ status: 200, type: StatisticsResponse })
  public progress(): Promise<StatisticsResponse> {
    return this.taskService.progress();
  }
}
