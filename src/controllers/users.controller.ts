import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { UpdateUserDTO } from 'src/common/classes/schemas/update-profile-info.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersService } from 'src/services/users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('/email')
  getUserByEmail(@Query('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Put('/update-user')
  @UsePipes(ZodValidationPipe)
  updateUser(@Body() data: Partial<CreateUserDTO>) {
    return this.usersService.updateUser(data);
  }

  @Put('/update-profile/:userId')
  @UsePipes(ZodValidationPipe)
  updateProfile(
    @Body() data: Partial<UpdateUserDTO>,
    @Param('userId') userId: string,
  ) {
    return this.usersService.updateUserProfile(userId, data);
  }

  @Put('/update-role')
  updateUserRole(@Body() data: { id: string; newRole: Role }) {
    return this.usersService.updateRole(data.id, data.newRole);
  }

  @Delete()
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
