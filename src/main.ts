import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  const frontendUrls = process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(',') : '*';
  app.enableCors({
    origin: frontendUrls,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('SemtAğı API')
    .setDescription('Komisyonsuz Yemek Sipariş Platformu API Dokümantasyonu')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Kimlik Doğrulama')
    .addTag('users', 'Kullanıcı İşlemleri')
    .addTag('addresses', 'Adres Yönetimi')
    .addTag('restaurants', 'Restoran İşlemleri (Public)')
    .addTag('restaurant-panel', 'Restoran Panel İşlemleri')
    .addTag('menu', 'Menü Yönetimi')
    .addTag('orders', 'Sipariş İşlemleri')
    .addTag('reviews', 'Puanlama')
    .addTag('admin', 'Admin İşlemleri')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  
  // Seed Database (Sadece test için)
  try {
    const { PrismaClient } = require('@prisma/client');
    const bcrypt = require('bcrypt');
    const prisma = new PrismaClient();
    
    console.log('Veritabanı kontrol ediliyor...');
    const adminCount = await prisma.adminUser.count();
    
    if (adminCount === 0) {
      console.log('Veritabanı boş, test kullanıcıları oluşturuluyor...');
      const passwordHash = await bcrypt.hash('123456', 10);
      
      // Admin
      await prisma.adminUser.create({
        data: { email: 'admin@semtagi.com', passwordHash, name: 'Admin User' }
      });
      console.log('Admin oluşturuldu: admin@semtagi.com / 123456');

      // Restoran
      const restaurant = await prisma.restaurant.create({
        data: {
          name: 'Test Restoran', description: 'Test', phone: '0555', email: 'restoran@semtagi.com',
          address: 'Test Mah', isApproved: true, isActive: true
        }
      });
      // Restoran Yetkilisi
      await prisma.restaurantUser.create({
        data: { email: 'restoran@semtagi.com', passwordHash, name: 'Restoran Yetkilisi', restaurantId: restaurant.id }
      });
      console.log('Restoran oluşturuldu: restoran@semtagi.com / 123456');

      // Müşteri
      await prisma.user.create({
        data: { email: 'user@semtagi.com', passwordHash, name: 'Test Müşteri', phone: '0555', emailVerified: true }
      });
      console.log('Müşteri oluşturuldu: user@semtagi.com / 123456');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`🍽️  SemtAğı API çalışıyor: http://localhost:${port}`);
  console.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
