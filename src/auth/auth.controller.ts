import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { Public } from '../common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Yeni kullanıcı kaydı' })
  @ApiResponse({ status: 201, description: 'Kayıt başarılı, doğrulama kodu gönderildi' })
  @ApiResponse({ status: 409, description: 'E-posta zaten kayıtlı' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({ summary: 'E-posta doğrulama' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Kullanıcı girişi' })
  @ApiResponse({ status: 200, description: 'Giriş başarılı' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Şifre sıfırlama kodu gönder' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Şifreyi sıfırla' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
