import { Timeout } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Timeout(30_000)
  async initialize() {
    // TODO
  }
}
