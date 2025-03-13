import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from 'src/common/dtos/login.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }
}
