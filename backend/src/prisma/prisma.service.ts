import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {
      fullResults: true,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
