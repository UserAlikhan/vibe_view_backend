import { Module } from '@nestjs/common';
import { CameraUrlsService } from './camera-urls.service';
import { CameraUrlsController } from './camera-urls.controller';

@Module({
  controllers: [CameraUrlsController],
  providers: [CameraUrlsService],
})
export class CameraUrlsModule {}
