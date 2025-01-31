import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Prisma } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(@Body() createReviewDto: Prisma.ReviewsCreateInput) {
    return await this.reviewsService.create(createReviewDto);
  }

  @Get(':barId')
  async findAllForSpecificBar(@Param('barId') barId: number) {
    return await this.reviewsService.findAllForSpecificBar(barId);
  }

  @Get(':userId')
  async findUsersReviews(@Param('userId') userId: number) {
    return await this.reviewsService.findUsersReviews(userId);
  }

  @Patch(':id')
  async updateReview(
    @Param('id') id: number,
    @Body() updateReviewDto: Prisma.ReviewsUpdateInput,
  ) {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: number) {
    return await this.reviewsService.delete(id);
  }
}
