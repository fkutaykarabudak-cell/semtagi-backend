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
  await app.listen(port, '0.0.0.0');
  console.log(`🍽️  SemtAğı API çalışıyor: http://localhost:${port}`);
  console.log(`📄 Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
