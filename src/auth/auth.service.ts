import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ============ KAYIT ============

  async register(dto: RegisterDto) {
    // E-posta kontrolü
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Bu e-posta adresi zaten kayıtlı');
    }

    // Şifre hash
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Doğrulama kodu
    const verifyCode = this.generateCode();
    const verifyCodeExp = new Date(Date.now() + 15 * 60 * 1000); // 15 dk

    // Kullanıcı oluştur
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        phone: dto.phone,
        verifyCode,
        verifyCodeExp,
      },
    });

    // TODO: E-posta gönder (prototipte console.log)
    console.log(`📧 Doğrulama kodu: ${verifyCode} → ${dto.email}`);

    return {
      message: 'Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.',
      // Prototipte kodu döndürüyoruz, production'da kaldırılacak
      verifyCode,
    };
  }

  // ============ E-POSTA DOĞRULAMA ============

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı');
    }

    if (user.emailVerified) {
      throw new BadRequestException('E-posta zaten doğrulanmış');
    }

    if (user.verifyCode !== dto.code) {
      throw new BadRequestException('Geçersiz doğrulama kodu');
    }

    if (user.verifyCodeExp && user.verifyCodeExp < new Date()) {
      throw new BadRequestException('Doğrulama kodunun süresi dolmuş');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyCode: null,
        verifyCodeExp: null,
      },
    });

    // Token döndür
    const tokens = await this.generateTokens(user.id, user.email, user.role, 'user');

    return {
      message: 'E-posta doğrulandı',
      ...tokens,
    };
  }

  // ============ GİRİŞ ============

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Lütfen önce e-posta adresinizi doğrulayın');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role, 'user');

    return {
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    };
  }

  // ============ ŞİFRE SIFIRLAMA ============

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Güvenlik: kullanıcı yoksa da aynı mesajı döndür
      return { message: 'Eğer e-posta kayıtlıysa, sıfırlama kodu gönderildi' };
    }

    const verifyCode = this.generateCode();
    const verifyCodeExp = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { verifyCode, verifyCodeExp },
    });

    console.log(`📧 Şifre sıfırlama kodu: ${verifyCode} → ${dto.email}`);

    return { message: 'Eğer e-posta kayıtlıysa, sıfırlama kodu gönderildi' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || user.verifyCode !== dto.code) {
      throw new BadRequestException('Geçersiz kod');
    }

    if (user.verifyCodeExp && user.verifyCodeExp < new Date()) {
      throw new BadRequestException('Kodun süresi dolmuş');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        verifyCode: null,
        verifyCodeExp: null,
      },
    });

    return { message: 'Şifre başarıyla değiştirildi' };
  }

  // ============ YARDIMCI METOTLAR ============

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateTokens(userId: string, email: string, role: string, type: string) {
    const payload = { sub: userId, email, role, type };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any,
    });

    return { accessToken };
  }
}
