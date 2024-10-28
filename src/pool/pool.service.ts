import {
  AnchorProvider,
  Program,
  Wallet,
  setProvider,
} from '@coral-xyz/anchor';
import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';

import { PriceService } from 'src/price/price.service';
import { PrismaService } from 'src/prisma/prisma.service';
import idl from 'idl/solana_program.json';

@Injectable()
export class PoolService {
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
    program.addEventListener('createPoolEvent', async (event: any) => {
      console.log('CreatePoolEvent: Captured');
      const address = (event.address as PublicKey).toBase58();
      const tokenMint = (event.tokenMint as PublicKey).toBase58();

      const tokenCreated = await this.prisma.token.create({
        select: {
          id: true,
        },
        data: {
          address: tokenMint,
          decimals: 9,
          unitAmount: 10 ** 9,
          poolAddress: address,
        },
      });
      console.log('CreatePoolEvent: Token Created');

      const response = await fetch(process.env.HELIUS_RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '9ruB56ZUbEmq7whokt52w8RcbEpUz9qJwpoaj6MrfwZS',
          method: 'getAssetBatch',
          params: {
            ids: [tokenMint],
          },
        }),
      });

      const data = await response.json();
      const poolData = data.result[0];
      let metaData = {
        name: '',
        symbol: '',
        image: '',
      };
      try {
        const response = await fetch(poolData.content.json_uri, {
          method: 'GET',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data1 = await response.json();
        metaData = {
          name: data1.name || '',
          symbol: data1.symbol || '',
          image: data1.image || '',
        };
      } catch (err) {
        console.log(err);
      }

      console.log('CreatePoolEvent: Start Updating', metaData);
      await this.prisma.token.update({
        where: {
          id: tokenCreated.id,
        },
        data: {
          ...metaData,
        },
      });
      console.log('CreatePoolEvent: Updating finished');
    });
  }
}
