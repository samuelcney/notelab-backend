import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';

import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDTO } from 'src/common/dtos/create-user.dto';
import { UsersService } from 'src/services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(Number(id));
  }

  @Get('/email')
  getUserByEmail(@Query('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  createUser(@Body() data: CreateUserDTO) {
    return this.usersService.createUser(data);
  }

  @Put('/:id')
  @UsePipes(ZodValidationPipe)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateUserDTO,
  ) {
    return this.usersService.updateUser(Number(id), data);
  }

  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(Number(id));
  }
}
