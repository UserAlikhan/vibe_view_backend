import { Module } from '@nestjs/common';
import { BarsService } from './bars.service';
import { BarsController } from './bars.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';
import { DatabaseService } from 'src/database/database.service';
import { BarsImagesService } from 'src/bars-images/bars-images.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BarsController],
  providers: [BarsService, UsersService, DatabaseService, BarsImagesService],
  exports: [BarsService],
})
export class BarsModule { }
