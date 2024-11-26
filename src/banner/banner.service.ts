import { Inject, Injectable, Logger } from '@nestjs/common';
import { Banner } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { BannerRequestService, BannerResponse } from 'src/model/banner.model';
import { BannerValidation } from './banner.validation';

@Injectable()
export class BannerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger,
    private readonly prisma: PrismaService,
    private validationService: ValidationService,
  ) {}
  toBannerResponse(banner: Banner): BannerResponse {
    return {
      banner_id: banner.banner_id,
      title: banner.title,
      image_url: banner.image_url,
      description: banner.description,
      status: banner.status,
      created_at: banner.created_at,
    };
  }

  async create(data: BannerRequestService): Promise<BannerResponse> {
    const createRequest = this.validationService.validate(
      BannerValidation.CREATE,
      data,
    );
    const banner = await this.prisma.banner.create({
      data: {
        banner_id: data.banner_id,
        title: createRequest.title,
        description: createRequest.description,
        status: createRequest.status,
        image_url: data.image_url,
      },
    });

    return this.toBannerResponse(banner);
  }
}
