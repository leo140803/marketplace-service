import { Injectable, Logger, Inject, HttpException } from '@nestjs/common';
import { PrismaService } from './../common/prisma.service';
import { ValidationService } from './../common/validation.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  StoreRequest,
  StoreResponse,
  UpdateStoreRequest,
} from 'src/model/store.model';
import Decimal from 'decimal.js';
import { Store } from '@prisma/client';
import { StoreValidation } from './store.validation';
import { WebResponse } from '../model/web.model';

@Injectable()
export class StoreService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private readonly prisma: PrismaService,
    private validationService: ValidationService,
  ) {}

  toStoreResponse(store: Store): StoreResponse {
    return {
      store_id: store.store_id,
      store_name: store.store_name,
      longitude: (store.longitude as Decimal).toNumber(),
      latitude: (store.latitude as Decimal).toNumber(),
      created_at: store.created_at,
      image_url: store.image_url,
    };
  }

  async findAll(): Promise<WebResponse<StoreResponse[]>> {
    const stores = await this.prisma.store.findMany();
    if (stores.length == 0) {
      this.logger.log('Stores not found!');
      throw new HttpException('Stores not found!', 404);
    }
    return {
      data: stores.map((store) => this.toStoreResponse(store)),
    };
  }

  async findOne(store_id: string): Promise<StoreResponse> {
    const store = await this.prisma.store.findUnique({ where: { store_id } });
    if (!store) throw new HttpException('Store not found!', 404);
    return this.toStoreResponse(store);
  }

  async create(
    data: StoreRequest & { image_url?: string },
  ): Promise<StoreResponse> {
    const createRequest = this.validationService.validate(
      StoreValidation.CREATE,
      data,
    );
    console.log(data.image_url);
    const store = await this.prisma.store.create({
      data: {
        store_id: data.store_id,
        store_name: createRequest.store_name,
        longitude: createRequest.longitude,
        latitude: createRequest.latitude,
        image_url: data.image_url,
      },
    });

    return this.toStoreResponse(store);
  }

  async update(
    store_id: string,
    data: UpdateStoreRequest & { image_url?: string },
  ): Promise<StoreResponse> {
    console.log(store_id);
    const store = await this.findOne(store_id);
    console.log(store);
    const updateRequest = this.validationService.validate(
      StoreValidation.UPDATE,
      data,
    );
    console.log(data);
    const update = await this.prisma.store.update({
      where: { store_id },
      data: {
        store_name: updateRequest.store_name ?? store.store_name,
        longitude: updateRequest.longitude ?? store.longitude,
        latitude: updateRequest.latitude ?? store.latitude,
        image_url: data.image_url,
      },
    });
    return this.toStoreResponse(update);
  }

  async remove(store_id: string): Promise<StoreResponse> {
    await this.findOne(store_id);
    const deleteStore = await this.prisma.store.delete({
      where: {
        store_id: store_id,
      },
    });
    return this.toStoreResponse(deleteStore);
  }
}
