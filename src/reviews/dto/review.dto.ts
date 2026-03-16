import { IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 'restaurant-uuid' })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ example: 'order-uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Harika lezzet, hızlı teslimat!' })
  @IsOptional()
  @IsString()
  comment?: string;
}
