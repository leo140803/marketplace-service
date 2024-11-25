import { IsString, IsUUID } from 'class-validator';

export class StoreRequest {
  @IsUUID('4', { message: 'Store ID must be a valid UUID (v4)' })
  store_id?: string;
  @IsString({ message: 'Store name is required' })
  store_name: string;

  longitude: number;

  latitude: number;
}

export class StoreResponse {
  store_id: string;
  store_name: string;
  longitude: number;
  latitude: number;
  created_at: Date;
  image_url?: string;
}

export class UpdateStoreRequest {
  store_name?: string;
  longitude?: number;
  latitude?: number;
  image_url?: string;
}
