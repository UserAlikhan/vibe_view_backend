import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Post()
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async addToFavorites(createFavoritesDto: Prisma.FavoritesCreateInput) {
    return await this.favoritesService.addToFavorites(createFavoritesDto);
  }

  @Get(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async getAllUsersFavorites(@Param('id') id: number) {
    return await this.favoritesService.getAllUsersFavorites(id);
  }

  @Delete(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async deleteFromFavorites(@Param('id') id: number) {
    return await this.favoritesService.deleteFromFavorites(id);
  }
}
