import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  email: string;

  @ApiProperty({ example: 'Sifre123!' })
  @IsString()
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  password: string;

  @ApiPropertyOptional({ example: 'Ali Yılmaz' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '05551234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Sifre123!' })
  @IsString()
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;
}

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google OAuth id_token' })
  @IsString()
  idToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'ali@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'YeniSifre123!' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
