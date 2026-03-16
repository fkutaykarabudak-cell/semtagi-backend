import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Kayıtlı adresleri listele' })
  findAll(@CurrentUser() user: any) {
    return this.addressesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni adres ekle' })
  create(@CurrentUser() user: any, @Body() dto: CreateAddressDto) {
    return this.addressesService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Adres güncelle' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Adres sil' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.addressesService.remove(user.id, id);
  }
}
