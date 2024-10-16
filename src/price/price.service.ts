import { Injectable, Logger } from '@nestjs/common';
import {
  AnchorProvider,
  Program,
  Wallet,
  setProvider,
} from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';

import { PrismaService } from 'src/prisma/prisma.service';
import idl from 'idl/solana_program.json';
import { Prisma } from '@prisma/client';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(private readonly prisma: PrismaService) {
    this.initialize();
  }

  async initialize() {
    console.log('Pool Service initialized..');
    const rpcEndpoint = clusterApiUrl('devnet');
    const connection = new Connection(rpcEndpoint);

    const provider = new AnchorProvider(
      connection,
      new Wallet(Keypair.generate()),
    );
    setProvider(provider);

    //@ts-ignore
    const program = new Program(idl, provider);
    program.addEventListener('purchaseEvent', (event: any) => {
      // const tokenAddress = (event.tokenMint as PublicKey).toBase58();

      // let token = this.prisma.token.findFirst({
      //   where: {
      //     address: tokenAddress,
      //   },
      // });

      // if (!token) {
      //   token = this.prisma.token.create({
      //     data: {
      //       address: tokenAddress,
      //       decimals: 8,
      //       unitAmount: 8 ** 10,
      //     },
      //   });
      // }

      // const tradingData: Prisma.TradingLogCreateInput = {
      //   amount: 
      // }
      console.log("Trading Captured : ", {
        type: event.transactionType,
        tokenMint: (event.tokenMint as PublicKey).toBase58(),
        amount: event.amount.toString(),
        solAmount: event.solAmount.toString(),
        reserveSol: event.reserveSol.toString(),
        reserveToken: event.reserveToken.toString(),
        totalSupply: event.totalSupply.toString(),
      });
    });
  }
}
