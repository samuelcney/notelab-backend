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

  @Put('/:id')
  @UsePipes(ZodValidationPipe)
  updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: CreateUserDTO,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
