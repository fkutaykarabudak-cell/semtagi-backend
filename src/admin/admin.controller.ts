import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('restaurants')
  @ApiOperation({ summary: 'Tüm restoranları listele' })
  getAllRestaurants() {
    return this.adminService.getAllRestaurants();
  }

  @Post('restaurants/:id/approve')
  @ApiOperation({ summary: 'Restoran başvurusu onayla' })
  approveRestaurant(@Param('id') id: string) {
    return this.adminService.approveRestaurant(id);
  }

  @Post('restaurants/:id/reject')
  @ApiOperation({ summary: 'Restoran başvurusu reddet' })
  rejectRestaurant(@Param('id') id: string) {
    return this.adminService.rejectRestaurant(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Sistem istatistiklerini getir' })
  getStats() {
    return this.adminService.getStats();
  }
}
