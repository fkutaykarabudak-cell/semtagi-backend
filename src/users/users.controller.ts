import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Profil bilgilerini getir' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Profil bilgilerini güncelle' })
  updateProfile(@CurrentUser() user: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }
}
