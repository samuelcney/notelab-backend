import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { LoginDTO } from 'src/common/classes/schemas/login.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDTO) {
    return this.authService.signIn(data);
  }

  @Post('recover-password')
  @UsePipes(ZodValidationPipe)
  async recoverPassword(@Body() data: { email: string }) {
    return this.authService.requestRecoverPassword(data.email);
  }

  @Post('register')
  @UsePipes(ZodValidationPipe)
  createUser(@Body() data: CreateUserDTO) {
    return this.authService.signUp(data);
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
    return { message: 'Logout realizado com sucesso' };
  }
}
