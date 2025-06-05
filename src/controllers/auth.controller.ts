import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ChangePasswordDTO } from 'src/common/classes/dtos/change-password.dto';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { LoginDTO } from 'src/common/classes/schemas/login.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDTO) {
    return this.authService.signIn(data);
  }

  @Post('register')
  @UsePipes(ZodValidationPipe)
  createUser(@Body() data: CreateUserDTO) {
    return this.authService.signUp(data);
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @UsePipes(ZodValidationPipe)
  async changePassword(@Body() data: ChangePasswordDTO) {
    return this.authService.changePassword(data);
  }
}
