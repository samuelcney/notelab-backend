import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(data: LoginDTO) {
    const userExist = await this.usersService
      .getUserByEmail(data.email)
      .catch(() => null);

    if (!userExist) {
      throw new UnauthorizedException({ message: 'Credenciais Inválidas' });
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      userExist.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException({ message: 'Credenciais Inválidas' });
    }

    const token = jwt.sign({ id: userExist.id }, process.env.SECRET, {
      expiresIn: 2,
    });

    return {
      statusCode: 200,
      message: 'Login realizado com sucesso!',
      token,
    };
  }
}
