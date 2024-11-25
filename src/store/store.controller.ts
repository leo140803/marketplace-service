import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Inject,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { v4 as uuidv4 } from 'uuid';
import {
  StoreRequest,
  StoreResponse,
  UpdateStoreRequest,
} from './../model/store.model';
import { WebResponse } from 'src/model/web.model';
import { ImageFileInterceptorForStoreLogo } from './../common/multer.config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import { join, extname } from 'path';
import { ClientProxy } from '@nestjs/microservices';

@Controller('/api/store')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    @Inject('PLATFORM_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  async findAll(): Promise<WebResponse<StoreResponse[]>> {
    return await this.storeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WebResponse<StoreResponse>> {
    const store = await this.storeService.findOne(id);
    return {
      data: store,
    };
  }

  @Post()
  @UseInterceptors(ImageFileInterceptorForStoreLogo())
  async create(
    @Body() body: StoreRequest,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<WebResponse<StoreResponse>> {
    const storeId = uuidv4();
    let uniqueFileName = '';
    let imageUrl;

    if (image) {
      uniqueFileName = `store-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(image.originalname)}`;
      const uploadPath = join(
        __dirname,
        '../../uploads/storeLogo',
        uniqueFileName,
      );

      if (!fs.existsSync(join(__dirname, '../../uploads/storeLogo'))) {
        fs.mkdirSync(join(__dirname, '../../uploads/storeLogo'), {
          recursive: true,
        });
      }

      fs.writeFileSync(uploadPath, image.buffer);
      imageUrl = `/uploads/storeLogo/${uniqueFileName}`;
    }
    const longitude = parseFloat(body.longitude as any);
    const latitude = parseFloat(body.latitude as any);
    const store = await this.storeService.create({
      store_id: storeId,
      store_name: body.store_name,
      longitude: longitude,
      latitude: latitude,
      image_url: imageUrl,
    });

    const data = {
      store_id: storeId,
      store_name: body.store_name,
      longitude: parseFloat(body.longitude as any),
      latitude: parseFloat(body.latitude as any),
      image_url: imageUrl,
      file_buffer: image?.buffer,
      file_name: uniqueFileName,
    };

    try {
      const response = await this.client.send('create_store', data).toPromise();
      console.log('Microservice Response:', response);
    } catch (error) {
      console.error('Error calling microservice:', error.message);
    }

    return {
      data: store,
    };
  }

  @Patch(':id')
  @UseInterceptors(ImageFileInterceptorForStoreLogo())
  async update(
    @Param('id') id: string,
    @Body() body: UpdateStoreRequest,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<WebResponse<StoreResponse>> {
    const updateData: any = { id };
    let uniqueFileName;
    let imageUrl;

    if (body.store_name !== undefined) {
      updateData.store_name = body.store_name;
    }
    if (body.longitude !== undefined) {
      updateData.longitude = parseFloat(body.longitude as any);
    }
    if (body.latitude !== undefined) {
      updateData.latitude = parseFloat(body.latitude as any);
    }

    if (image) {
      uniqueFileName = `store-${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}${extname(image.originalname)}`;
      const uploadPath = join(
        __dirname,
        '../../uploads/storeLogo',
        uniqueFileName,
      );

      if (!fs.existsSync(join(__dirname, '../../uploads/storeLogo'))) {
        fs.mkdirSync(join(__dirname, '../../uploads/storeLogo'), {
          recursive: true,
        });
      }
      fs.writeFileSync(uploadPath, image.buffer);

      imageUrl = `/uploads/storeLogo/${uniqueFileName}`;
      updateData.file_buffer = image.buffer;
      updateData.file_name = uniqueFileName;
      updateData.image_url = imageUrl;
    }

    if (Object.keys(updateData).length === 1) {
      throw new HttpException('No fields provided for update', 500);
    }
    const updatedStore = await this.storeService.update(id, {
      store_name: updateData.store_name,
      longitude: updateData.longitude,
      latitude: updateData.latitude,
      image_url: imageUrl,
    });
    try {
      const response = await firstValueFrom(
        this.client.send('update_store', updateData),
      );
      console.log('Response from subscriber --> ' + response);
    } catch (error) {
      console.error('Error calling microservice:', error.message);
    }
    return { data: updatedStore };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<WebResponse<StoreResponse>> {
    const store = await this.storeService.remove(id);
    if (store.image_url) {
      const filePath = join(__dirname, '../../', store.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted file:', filePath);
      } else {
        console.warn('File not found:', filePath);
      }
    }

    try {
      const response = await firstValueFrom(
        this.client.send('delete_store', id),
      );
      console.log('Response from subscriber --> ' + response);
    } catch (error) {
      console.error('Error calling microservice:', error.message);
    }
    return {
      data: store,
    };
  }
}
