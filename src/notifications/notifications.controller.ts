import { Controller, Get, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Bildirimleri listele' })
  findAll(@CurrentUser() user: any) {
    return this.notificationsService.findAllByUser(user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Bildirimi okundu olarak işaretle' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
