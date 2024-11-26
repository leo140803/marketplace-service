export class BannerRequestController {
  banner_id?: string;
  title: string;
  image_url?: string;
  description: string;
  status: string;
}

export class BannerRequestService {
  banner_id?: string;
  title: string;
  image_url?: string;
  description: string;
  status: boolean;
}

export class BannerResponse {
  banner_id: string;
  title: string;
  image_url: string;
  description: string;
  status: boolean;
  created_at: Date;
}
export class BannerUpdateRequestController {
  title?: string;
  image_url?: string;
  description?: string;
  status?: string;
}

export class BannerUpdateRequestService {
  title?: string;
  image_url?: string;
  description?: string;
  status?: string;
}
