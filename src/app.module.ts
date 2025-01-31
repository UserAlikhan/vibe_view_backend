import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { BarsModule } from './bars/bars.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesService } from './favorites/favorites.service';
import { FavoritesController } from './favorites/favorites.controller';
import { FavoritesModule } from './favorites/favorites.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [DatabaseModule, BarsModule, UsersModule, ReviewsModule, FavoritesModule, AuthModule],
  controllers: [AppController, FavoritesController],
  providers: [AppService, FavoritesService, RolesGuard],
})

export class AppModule { }
