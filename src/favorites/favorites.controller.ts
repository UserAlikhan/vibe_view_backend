import { Controller, Delete, Get, Param, Post, UseGuards, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async addToFavorites(@Body() createFavoritesDto: { user_id: number, bar_id: number }) {
    return await this.favoritesService.addToFavorites(createFavoritesDto);
  }

  @Get('/checkupdate')
  async checkUpdate() {
    return await {
      message: 'Check update',
      status: 'success',
      timestamp: new Date().toISOString(),
      path: '/favorites/checkupdate',
    }
  }

  @Get('/user/:userId')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async getUserFavorites(@Param('userId') userId: number) {
    return await this.favoritesService.getUserFavorites(userId);
  }

  @Get('/user/:userId/ids')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async getIdsOfUserFavoriteBars(@Param('userId') userId: number) {
    return await this.favoritesService.getIdsOfUserFavoriteBars(userId);
  }

  @Get(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async getAllUsersFavorites(@Param('id') id: number) {
    return await this.favoritesService.getAllUsersFavorites(id);
  }

  @Delete(':userId/:barId')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async deleteFromFavorites(@Param('userId') userId: number, @Param('barId') barId: number) {
    return await this.favoritesService.deleteFromFavorites(userId, barId);
  }

  @Delete("/all/:userId")
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async deleteAllFavorites(@Param('userId') userId: number) {
    return await this.favoritesService.deleteAllFavorites(userId);
  }
}