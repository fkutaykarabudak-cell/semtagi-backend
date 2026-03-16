import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Aynı sipariş için mükerrer yorum kontrolü
    const existing = await this.prisma.review.findUnique({
      where: { orderId: dto.orderId },
    });
    if (existing) throw new ConflictException('Bu sipariş için zaten yorum yapılmış');

    const review = await this.prisma.review.create({
      data: {
        userId,
        ...dto,
      },
    });

    // Restoran puanını güncelle
    const stats = await this.prisma.review.aggregate({
      where: { restaurantId: dto.restaurantId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.restaurant.update({
      where: { id: dto.restaurantId },
      data: {
        rating: stats._avg.rating || 0,
        totalReviews: stats._count.rating || 0,
      },
    });

    return review;
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.review.findMany({
      where: { restaurantId },
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
