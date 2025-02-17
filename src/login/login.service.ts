import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { NotFoundException } from '@nestjs/common';

export class LoginService {
  constructor(private readonly usersService: UsersService) {}

  async login(data: LoginDTO) {
    const userExist = await this.usersService.getUserByEmail(data.email);

    if (!userExist) {
      throw new NotFoundException(`Credenciais Inválidas`);
    }
  }
}
