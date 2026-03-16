import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Ali Yılmaz' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '05551234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}
