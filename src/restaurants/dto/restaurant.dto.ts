import { IsString, IsOptional, IsEmail, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Doyuran Kebap' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Lezzetli kebapların adresi' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '0212 123 45 67' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'info@doyurankebap.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  @IsString()
  taxNumber?: string;

  @ApiProperty({ example: 'Atatürk Mah. İstanbul Cad. No:5 Kadıköy' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 'Kadıköy' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'İstanbul' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 40.9912 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 29.0228 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @ApiPropertyOptional({ example: 'Kendi kuryemiz ile 30-45 dk' })
  @IsOptional()
  @IsString()
  deliveryInfo?: string;
}

export class UpdateRestaurantDto extends CreateRestaurantDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  workingHours?: any;
}

export class RestaurantSearchDto {
  @ApiPropertyOptional({ example: 'Kebap' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 40.9912 })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 29.0228 })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ example: 'Burger' })
  @IsOptional()
  @IsString()
  category?: string;
}
