import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule { }
