import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { StoreModule } from './store/store.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    CommonModule,
    StoreModule,
    BannerModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix to access files
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
