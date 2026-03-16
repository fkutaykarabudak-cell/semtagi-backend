import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from './dto/order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: dto.restaurantId },
    });

    if (!restaurant) throw new NotFoundException('Restoran bulunamadı');
    if (!restaurant.isOpen) throw new BadRequestException('Restoran şu an kapalı');

    // Sipariş numarası oluştur
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    const orderNumber = `SMA-${dateStr}-${randomStr}`;

    // Ürünleri kontrol et ve toplam tutarı hesapla
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, restaurantId: dto.restaurantId, isActive: true },
      });

      if (!product) throw new BadRequestException(`Ürün bulunamadı: ${item.productId}`);

      const unitPrice = product.discountPrice || product.price;
      const itemTotalPrice = unitPrice * item.quantity;
      totalAmount += itemTotalPrice;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: itemTotalPrice,
        note: item.note,
      });
    }

    if (totalAmount < restaurant.minOrderAmount) {
      throw new BadRequestException(`Minimum sipariş tutarı: ${restaurant.minOrderAmount} TL`);
    }

    // Siparişi veritabanına kaydet
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        restaurantId: dto.restaurantId,
        addressId: dto.addressId,
        paymentMethod: dto.paymentMethod,
        mealCardBrand: dto.mealCardBrand,
        deliveryType: dto.deliveryType,
        note: dto.note,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        restaurant: {
          select: { name: true, phone: true },
        },
      },
    });

    // TODO: WebSocket ile restorana bildir (Phase 2'de gateway eklenecek)
    console.log(`🔔 Yeni Sipariş: ${orderNumber} -> ${restaurant.name}`);

    return order;
  }

  async findAllByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        restaurant: {
          select: { name: true, logoUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByRestaurant(restaurantId: string) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        items: true,
        user: {
          select: { name: true, phone: true },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        restaurant: true,
        address: true,
        user: {
          select: { name: true, phone: true },
        },
      },
    });
    if (!order) throw new NotFoundException('Sipariş bulunamadı');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        cancelReason: dto.cancelReason,
      },
      include: {
        user: { select: { email: true } },
      },
    });

    // TODO: WebSocket ile kullanıcıya bildir
    console.log(`📱 Sipariş Durumu Güncellendi: ${order.orderNumber} -> ${dto.status}`);

    return order;
  }
}
