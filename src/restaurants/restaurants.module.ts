import { Module } from '@nestjs/common';
import { RestaurantsController, RestaurantPanelController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  controllers: [RestaurantsController, RestaurantPanelController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
