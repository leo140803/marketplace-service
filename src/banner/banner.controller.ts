import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { join } from 'path';
import { WebResponse } from 'src/model/web.model';
import * as fs from 'fs';
import { BannerService } from './banner.service';

@Controller('/api/banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @MessagePattern('create_banner')
  async createBanner(data: any): Promise<WebResponse<any>> {
    const { banner_id, title, description, status, file_buffer, file_name } =
      data;
    let imageUrl = null;
    if (file_buffer) {
      const uploadPath = join(__dirname, '../../uploads/banner', file_name);

      if (!fs.existsSync(join(__dirname, '../../uploads/banner'))) {
        fs.mkdirSync(join(__dirname, '../../uploads/banner'), {
          recursive: true,
        });
      }
      fs.writeFileSync(uploadPath, Buffer.from(file_buffer));
      console.log('File saved locally as:', file_name);

      imageUrl = `/uploads/banner/${file_name}`;
    }

    const banner = await this.bannerService.create({
      banner_id: banner_id,
      title: title,
      description: description,
      status: status,
      image_url: imageUrl,
    });
    return {
      data: banner,
    };
  }

  @MessagePattern('update_banner')
  async updateBanner(data: any): Promise<WebResponse<any>> {
    console.log('udah masuk ya');
    const { banner_id, title, description, status, file_buffer, file_name } =
      data;

    let imageUrl = null;
    if (file_buffer) {
      const uploadPath = join(__dirname, '../../uploads/banner', file_name);

      if (!fs.existsSync(join(__dirname, '../../uploads/banner'))) {
        fs.mkdirSync(join(__dirname, '../../uploads/banner'), {
          recursive: true,
        });
      }
      fs.writeFileSync(uploadPath, Buffer.from(file_buffer));
      console.log('File saved locally as:', file_name);

      imageUrl = `/uploads/banner/${file_name}`;
    }

    const updateBaneer = this.bannerService.update(banner_id, {
      title: title,
      description: description,
      status: status,
      image_url: imageUrl,
    });

    return {
      data: updateBaneer,
    };
  }

  @MessagePattern('delete_banner')
  async remove(id: string): Promise<WebResponse<any>> {
    const banner = await this.bannerService.delete(id);
    if (banner.image_url) {
      const filePath = join(__dirname, '../../', banner.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted file:', filePath);
      } else {
        console.warn('File not found:', filePath);
      }
    }
    return {
      data: banner,
    };
  }
}
