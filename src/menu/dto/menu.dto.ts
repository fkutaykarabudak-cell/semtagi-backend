import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Ana Yemekler' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ example: 'restaurant-uuid' })
  @IsUUID()
  restaurantId: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Ana Yemekler' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'category-uuid' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'restaurant-uuid' })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ example: 'Adana Kebap' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Özel baharatlı zırh kıyması' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 220 })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
