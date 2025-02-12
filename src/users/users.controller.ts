import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  createUser(@Body() data: CreateUserDTO) {
    return this.usersService.createUser(data);
  }
}
