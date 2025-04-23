import { Module } from '@nestjs/common';
import { BarsImagesService } from './bars-images.service';
import { BarsImagesController } from './bars-images.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BarsImagesController],
  providers: [BarsImagesService],
  exports: [BarsImagesService]
})
export class BarsImagesModule {}
