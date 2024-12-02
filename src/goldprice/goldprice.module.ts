import { Module } from '@nestjs/common';
import { GoldpriceService } from './goldprice.service';
import { GoldpriceController } from './goldprice.controller';

@Module({
  providers: [GoldpriceService],
  controllers: [GoldpriceController],
})
export class GoldpriceModule {}
