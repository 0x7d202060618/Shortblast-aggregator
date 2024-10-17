import { Injectable, Logger } from '@nestjs/common';
import {
  AnchorProvider,
  Program,
  Wallet,
  setProvider,
} from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Prisma, TradingKind } from '@prisma/client';
import BN from 'bn.js';
import { Timeout } from '@nestjs/schedule';
import Decimal from 'decimal.js';

import { PrismaService } from 'src/prisma/prisma.service';
import idl from 'idl/solana_program.json';
import { calcTokenPrice } from 'src/lib/utils';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Timeout(1000)
  async initialize() {
    const rpcEndpoint = clusterApiUrl('devnet');
    const connection = new Connection(rpcEndpoint);

    const provider = new AnchorProvider(
      connection,
      new Wallet(Keypair.generate()),
    );
    setProvider(provider);

    //@ts-ignore
    const program = new Program(idl, provider);
    program.addEventListener('purchaseEvent', async (event: any) => {
      // console.log('Trading Captured : ', {
      //   type: event.transactionType,
      //   tokenMint: (event.tokenMint as PublicKey).toBase58(),
      //   amount: event.amount.toString(),
      //   solAmount: event.solAmount.toString(),
      //   reserveSol: event.reserveSol.toString(),
      //   reserveToken: event.reserveToken.toString(),
      //   totalSupply: event.totalSupply.toString(),
      // });
      const tokenAddress = (event.tokenMint as PublicKey).toBase58();

      let token = await this.prisma.token.findFirst({
        where: {
          address: tokenAddress,
        },
      });

      if (!token) {
        token = await this.prisma.token.create({
          data: {
            address: tokenAddress,
            decimals: 9,
            unitAmount: 10 ** 9,
          },
        });
      }

      const totalSupply = new BN(event.totalSupply.toString()),
        reserveToken = new BN(event.reserveToken.toString());

      const soldToken = totalSupply.sub(reserveToken);
      // const price = new Decimal(
      //   reserveSol
      //     .mul(new BN(10 ** 9))
      //     .div(soldToken)
      //     .toString(),
      // ).div(10 ** 9);

      const price = calcTokenPrice(new Decimal(soldToken.toString()), 147);

      console.log('price: ', price.toString());

      const latestPrice = await this.prisma.tokenPrice.findFirst({
        select: {
          price: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
      });

      if (latestPrice && price.eq(latestPrice.price)) {
        console.warn('Warning: Same Log Detected...');
        return;
      }

      const tradingData: Prisma.TradingLogCreateManyInput = {
        amount: BigInt(event.amount.toString()),
        solAmount: BigInt(event.solAmount.toString()),
        tokenId: token.id,
        kind: event.transactionType == 0 ? TradingKind.BUY : TradingKind.SELL,
      };
      const priceData: Prisma.TokenPriceCreateManyInput = {
        tokenId: token.id,
        price: price,
      };
      await this.prisma.tradingLog.createMany({ data: [tradingData] });
      await this.prisma.tokenPrice.createMany({ data: [priceData] });
    });
  }
}
