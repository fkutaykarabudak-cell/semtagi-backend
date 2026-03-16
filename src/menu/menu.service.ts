import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateProductDto, UpdateProductDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Categories
  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async removeCategory(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Kategori silindi' };
  }

  // Products
  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async removeProduct(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Ürün silindi' };
  }

  async getMenuByRestaurant(restaurantId: string) {
    return this.prisma.category.findMany({
      where: { restaurantId, isActive: true },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
