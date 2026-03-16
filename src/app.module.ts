import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AddressesModule } from './addresses/addresses.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    AddressesModule,
    RestaurantsModule,
    MenuModule,
    OrdersModule,
    ReviewsModule,
    AdminModule,
    NotificationsModule,
  ],
})
export class AppModule {}
