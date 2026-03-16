import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { UpdateRestaurantDto, RestaurantSearchDto } from './dto/restaurant.dto';
import { Public } from '../common/decorators';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Restoranları listele (Public)' })
  findAll(@Query() query: RestaurantSearchDto) {
    return this.restaurantsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Restoran detay ve menü getir (Public)' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }
}

@ApiTags('restaurant-panel')
@ApiBearerAuth()
@Controller('restaurant-panel')
export class RestaurantPanelController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Panel dashboard istatistikleri' })
  getDashboard(@Query('restaurantId') id: string) {
    // TODO: JWT'den gelen kullanıcı yetkisini kontrol et (bu restoranın sahibi mi?)
    return this.restaurantsService.getDashboardStats(id);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Restoran ayarlarını güncelle' })
  update(@Query('restaurantId') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, dto);
  }

  @Put('toggle-open')
  @ApiOperation({ summary: 'Restoranı siparişe aç/kapat' })
  toggleOpen(@Query('restaurantId') id: string, @Body('isOpen') isOpen: boolean) {
    return this.restaurantsService.setOpenStatus(id, isOpen);
  }
}
