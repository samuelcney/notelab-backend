import { UsersService } from 'src/services/users.service';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { LoginDTO } from 'src/common/classes/dtos/login.dto';
import { supabase } from 'src/database/supabase';
import { CreateUserDTO } from 'src/common/classes/dtos/create-user.dto';

configDotenv();

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(data: LoginDTO) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      status: 200,
      message: 'Login realizado com sucesso',
      token: authData.session.access_token,
    };
  }

  async signUp(data: CreateUserDTO) {
    try {
      const { data: userData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error?.message === 'User already exists') {
          throw new UnauthorizedException(
            'O email inserido já está cadastrado',
          );
        }
        throw new InternalServerErrorException(error);
      }

      if (!userData.user?.id) {
        throw new InternalServerErrorException(
          'Erro ao obter ID do usuário criado',
        );
      }

      const user = await this.usersService.createUser({
        ...data,
        id: userData.user.id,
      });
      return {
        status: 201,
        message: 'Usuário criado com sucesso',
        user,
      };
    } catch (error) {
      console.error('Erro no signUp:', error);
      throw new InternalServerErrorException('Erro ao registrar usuário');
    }
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
