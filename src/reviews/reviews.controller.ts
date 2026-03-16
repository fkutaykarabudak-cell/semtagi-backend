import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { CurrentUser, Public } from '../common/decorators';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Siparişe puan/yorum yap' })
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @Public()
  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Restoran yorumlarını listele (Public)' })
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.reviewsService.findByRestaurant(restaurantId);
  }
}
