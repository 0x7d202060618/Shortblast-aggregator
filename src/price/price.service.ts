import { Injectable, Logger } from '@nestjs/common';
import {
  AnchorProvider,
  Program,
  Wallet,
  setProvider,
} from '@coral-xyz/anchor';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';

import { PrismaService } from 'src/prisma/prisma.service';
import idl from 'idl/solana_program.json';

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
      console.log(event, {
        reserveSol: event.reserveSol.toString(),
        reserveToken: event.reserveToken.toString(),
        totalSupply: event.totalSupply.toString(),
      });
    });
  }
}
