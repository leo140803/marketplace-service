import { PrismaService } from './../src/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject, Logger } from '@nestjs/common';

export class TestService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async deleteStore() {
    await this.prismaService.store.deleteMany({
      where: {
        store_name: {
          contains: 'store_testing',
        },
      },
    });
  }
}
