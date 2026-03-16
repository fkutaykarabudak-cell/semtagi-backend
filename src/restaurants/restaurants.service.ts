import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto, RestaurantSearchDto } from './dto/restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: RestaurantSearchDto) {
    const { q, category } = query;
    
    // Basit bir filtreleme mantığı
    return this.prisma.restaurant.findMany({
      where: {
        isApproved: true,
        isActive: true,
        AND: [
          q ? { name: { contains: q } } : {},
          category ? { categories: { some: { name: { contains: category } } } } : {},
        ],
      },
      include: {
        categories: {
          where: { isActive: true },
          take: 5,
        },
      },
    });
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: {
          where: { isActive: true },
          include: {
            products: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restoran bulunamadı');
    }

    return restaurant;
  }

  // Panel işlemleri
  async update(id: string, dto: UpdateRestaurantDto) {
    return this.prisma.restaurant.update({
      where: { id },
      data: dto,
    });
  }

  async setOpenStatus(id: string, isOpen: boolean) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isOpen },
    });
  }

  async getDashboardStats(id: string) {
    const totalOrders = await this.prisma.order.count({ where: { restaurantId: id } });
    const activeOrders = await this.prisma.order.count({ 
      where: { 
        restaurantId: id, 
        status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'ON_THE_WAY'] } 
      } 
    });
    
    const revenue = await this.prisma.order.aggregate({
      where: { restaurantId: id, status: 'DELIVERED' },
      _sum: { totalAmount: true },
    });

    return {
      totalOrders,
      activeOrders,
      totalRevenue: revenue._sum.totalAmount || 0,
    };
  }
}
