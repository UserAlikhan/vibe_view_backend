import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Prisma } from '@prisma/client';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async addToFavorites(createFavoritesDto: Prisma.FavoritesCreateInput) {
    return await this.favoritesService.addToFavorites(createFavoritesDto);
  }

  @Get(':id')
  async getAllUsersFavorites(@Param('id') id: number) {
    return await this.favoritesService.getAllUsersFavorites(id);
  }

  @Delete(':id')
  async deleteFromFavorites(@Param('id') id: number) {
    return await this.favoritesService.deleteFromFavorites(id);
  }
}
