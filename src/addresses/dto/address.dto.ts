import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Ev' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Atatürk Cad. No:12 Daire:5 Kadıköy/İstanbul' })
  @IsString()
  fullAddress: string;

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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}
