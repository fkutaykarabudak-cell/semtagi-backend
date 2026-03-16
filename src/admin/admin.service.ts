import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async approveRestaurant(id: string) {
    return this.prisma.restaurant.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async rejectRestaurant(id: string) {
    // Prototipte sadece onay bekleyenlerden silme yapabiliriz veya status ekleyebiliriz
    // Şu an sadece approved: false kalsın, gerekirse silinebilir.
    return this.prisma.restaurant.update({
      where: { id },
      data: { isApproved: false },
    });
  }

  async getAllRestaurants() {
    return this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalRestaurants = await this.prisma.restaurant.count();
    const totalOrders = await this.prisma.order.count();
    const totalRevenue = await this.prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { totalAmount: true },
    });

    return {
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }
}
