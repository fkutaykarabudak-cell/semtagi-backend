import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async create(userId: string, dto: CreateAddressDto) {
    // Eğer default yapılıyorsa, diğerlerini default'tan çıkar
    if (dto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Adres bulunamadı');

    if (dto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id: addressId },
      data: dto,
    });
  }

  async remove(userId: string, addressId: string) {
    const address = await this.prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) throw new NotFoundException('Adres bulunamadı');

    await this.prisma.userAddress.delete({ where: { id: addressId } });
    return { message: 'Adres silindi' };
  }
}
