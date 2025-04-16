import { Module } from '@nestjs/common';
import { BarsImagesService } from './bars-images.service';
import { BarsImagesController } from './bars-images.controller';
import { DatabaseService } from 'src/database/database.service';
import { BarsService } from 'src/bars/bars.service';
import { DatabaseModule } from 'src/database/database.module';
import { BarsModule } from 'src/bars/bars.module';

@Module({
  imports: [DatabaseModule, BarsModule],
  controllers: [BarsImagesController],
  providers: [BarsImagesService, DatabaseService, BarsService],
  exports: [BarsImagesService]
})
export class BarsImagesModule {}
