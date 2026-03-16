import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni sipariş oluştur' })
  create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Kullanıcının sipariş geçmişini getir' })
  findAllByUser(@CurrentUser() user: any) {
    return this.ordersService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Sipariş detayını getir' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Siparişi iptal et (kullanıcı)' })
  cancel(@Param('id') id: string, @Body('reason') reason: string) {
    return this.ordersService.updateStatus(id, { status: 'CANCELLED' as any, cancelReason: reason });
  }
}

@ApiTags('restaurant-panel')
@ApiBearerAuth()
@Controller('restaurant-panel/orders')
export class RestaurantOrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Restoranın siparişlerini listele' })
  findAll(@Query('restaurantId') restaurantId: string) {
    return this.ordersService.findAllByRestaurant(restaurantId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Sipariş durumunu güncelle (onayla, yola çıktı vb.)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
