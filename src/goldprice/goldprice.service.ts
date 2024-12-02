import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class GoldpriceService {
  constructor(private readonly prisma: PrismaService) {}
  @Cron('23 0 * * *', {
    timeZone: 'Asia/Jakarta',
  })
  async handleCron() {
    console.log('RUNNING!');
    try {
      const data = await this.scrapeData();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }

  async scrapeData(): Promise<any> {
    const url = 'https://anekalogam.co.id/id';
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const html = response.data;
    const $ = cheerio.load(html);
    const titleElement = $('h2.ngc-title').filter((_, element) => {
      return $(element).text().trim() === 'Harga Beli';
    });

    if (!titleElement.length) {
      throw new Error(
        'No element with class ngc-title and text "Harga Beli" found',
      );
    }

    const priceElement = titleElement.next('.content').find('span.tprice');

    if (!priceElement.length) {
      throw new Error('No element with class tprice found');
    }
    const priceText = priceElement.text().trim();

    if (!priceText) {
      throw new Error('No text found in the span with class tprice');
    }

    return priceText;
  }

  async getNow(): Promise<any> {
    const goldPrice = await this.prisma.goldPrice.findFirst({
      orderBy: { scraped_at: 'desc' },
    });

    return goldPrice.price;
  }
}
