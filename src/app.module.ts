import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PriceService } from './price/price.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PriceService, PrismaService],
})
export class AppModule {}
