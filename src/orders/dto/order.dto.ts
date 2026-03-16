import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  MEAL_CARD = 'MEAL_CARD',
}

export enum DeliveryType {
  DELIVERY = 'DELIVERY',
  PICKUP = 'PICKUP',
}

export class OrderItemDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({ example: 'Soğansız olsun' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'restaurant-uuid' })
  @IsUUID()
  restaurantId: string;

  @ApiPropertyOptional({ example: 'address-uuid' })
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional({ example: 'Sodexo' })
  @IsOptional()
  @IsString()
  mealCardBrand?: string;

  @ApiProperty({ enum: DeliveryType, example: DeliveryType.DELIVERY })
  @IsEnum(DeliveryType)
  deliveryType: DeliveryType;

  @ApiPropertyOptional({ example: 'Kapıyı çalmayın bebek uyuyor' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancelReason?: string;
}
