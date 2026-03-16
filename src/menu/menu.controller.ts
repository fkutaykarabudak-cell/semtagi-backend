import { Controller, Post, Put, Delete, Body, Param, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateProductDto, UpdateProductDto } from './dto/menu.dto';
import { Public } from '../common/decorators';

@ApiTags('menu')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // Categories
  @Post('categories')
  @ApiOperation({ summary: 'Kategori oluştur' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Kategori güncelle' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.menuService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Kategori sil' })
  removeCategory(@Param('id') id: string) {
    return this.menuService.removeCategory(id);
  }

  // Products
  @Post('products')
  @ApiOperation({ summary: 'Ürün oluştur' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.menuService.createProduct(dto);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Ürün güncelle' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.menuService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Ürün sil' })
  removeProduct(@Param('id') id: string) {
    return this.menuService.removeProduct(id);
  }

  @Public()
  @Get('restaurant/:restaurantId')
  @ApiOperation({ summary: 'Restoranın tüm menüsünü getir (Public)' })
  getMenu(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getMenuByRestaurant(restaurantId);
  }
}
