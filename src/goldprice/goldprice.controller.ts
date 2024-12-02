import { Controller, Get } from '@nestjs/common';
import { GoldpriceService } from './goldprice.service';

@Controller('/api/goldprice')
export class GoldpriceController {
  constructor(private readonly goldPriceService: GoldpriceService) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.goldPriceService.handleCron();
  }

  @Get('/now')
  async findPriceNow(): Promise<any> {
    return await this.goldPriceService.handleCron();
  }
}
