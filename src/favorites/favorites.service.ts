import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService
  ) { }

  async addToFavorites(createFavoritesDto: { user_id: number, bar_id: number }) {
    // check if user exists first
    const user = await this.usersService.findOne(createFavoritesDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // check if bar already in favorites, user cannot add the same bar twice
    const alreadyInFavorites = true ? await this.databaseService.favorites.findFirst({
      where: {
        user_id: user.id,
        bar_id: createFavoritesDto.bar_id,
      }
    }) : false;

    if (alreadyInFavorites) {
      throw new BadRequestException('For specific user, bar already in favorites');
    }

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

  async getUserFavorites(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.databaseService.favorites.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        bar: true,
      }
    })
  }

  async getIdsOfUserFavoriteBars(userId: number) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userBars = await this.databaseService.favorites.findMany({
      where: {
        user_id: user.id
      },
      select: {
        bar_id: true,
      }
    })

    return userBars.map(bar => bar.bar_id);
  }

  async deleteFromFavorites(userId: number, barId: number) {
    const favorite = await this.databaseService.favorites.findFirst({
      where: {
        user_id: userId,
        bar_id: barId,
      }
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    return await this.databaseService.favorites.delete({
      where: {
        id: favorite.id
      },
    });
  }

  async deleteAllFavorites(userId: number) {
    return await this.databaseService.favorites.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }
}
