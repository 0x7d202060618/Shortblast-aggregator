import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PriceService } from './price/price.service';
import { PrismaService } from './prisma/prisma.service';
import { PoolService } from './pool/pool.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PriceService, PrismaService, PoolService],
})
export class AppModule {}
