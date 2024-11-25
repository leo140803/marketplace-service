import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { PrismaService } from '../src/common/prisma.service';

@Module({
  providers: [TestService, PrismaService],
})
export class TestModule {}
