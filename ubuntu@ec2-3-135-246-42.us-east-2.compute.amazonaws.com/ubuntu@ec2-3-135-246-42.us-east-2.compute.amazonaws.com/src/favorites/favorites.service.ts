import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addToFavorites(createFavoritesDto: Prisma.FavoritesCreateInput) {
    return await this.databaseService.favorites.create({
      data: createFavoritesDto,
    });
  }

  async getAllUsersFavorites(id: number) {
    return await this.databaseService.favorites.findMany({
      where: {
        id: id,
      },
    });
  }

  async deleteFromFavorites(id: number) {
    return await this.databaseService.favorites.delete({
      where: {
        id: id,
      },
    });
  }
}
