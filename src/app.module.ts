import { Module } from '@nestjs/common';
import { PriceService } from './price/price.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PriceService, PrismaService],
})
export class AppModule {}
