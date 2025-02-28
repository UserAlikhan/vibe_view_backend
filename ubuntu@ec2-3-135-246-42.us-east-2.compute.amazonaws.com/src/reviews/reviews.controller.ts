import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async createReview(@Body() createReviewDto: Prisma.ReviewsCreateInput) {
    return await this.reviewsService.create(createReviewDto);
  }

  @Get(':barId')
  async findAllForSpecificBar(@Param('barId') barId: number) {
    return await this.reviewsService.findAllForSpecificBar(barId);
  }

  @Get('/user/:userId')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async findUsersReviews(@Param('userId') userId: number) {
    return await this.reviewsService.findUsersReviews(userId);
  }

  @Patch(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async updateReview(
    @Param('id') id: number,
    @Body() updateReviewDto: Prisma.ReviewsUpdateInput,
  ) {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async deleteReview(@Param('id') id: number) {
    return await this.reviewsService.delete(id);
  }
}
