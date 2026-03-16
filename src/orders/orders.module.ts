import { Module } from '@nestjs/common';
import { OrdersController, RestaurantOrderController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController, RestaurantOrderController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
