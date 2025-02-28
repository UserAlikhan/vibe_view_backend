import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReviewDto: Prisma.ReviewsCreateInput) {
    return await this.databaseService.reviews.create({ data: createReviewDto });
  }

  async findAllForSpecificBar(barId: number) {
    return await this.databaseService.reviews.findMany({
      where: {
        bar_id: barId,
      },
    });
  }

  async findUsersReviews(userId: number) {
    return await this.databaseService.reviews.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  async update(id: number, updateReviewDto: Prisma.ReviewsUpdateInput) {
    return await this.databaseService.reviews.update({
      where: {
        id: id,
      },
      data: updateReviewDto,
    });
  }

  async delete(id: number) {
    return await this.databaseService.reviews.delete({
      where: {
        id: id,
      },
    });
  }
}
