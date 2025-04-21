import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDTO } from 'src/common/classes/dtos/create-user.dto';
import { UsersService } from 'src/services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('/email')
  getUserByEmail(@Query('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Put()
  @UsePipes(ZodValidationPipe)
  updateUser(@Body() data: Partial<CreateUserDTO>) {
    return this.usersService.updateUser(data);
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
