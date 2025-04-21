import { UsersService } from 'src/services/users.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { LoginDTO } from 'src/common/classes/dtos/login.dto';
import { supabase, supabaseAdmin } from 'src/database/supabase';
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
      user: authData.user,
    };
  }

  async signUp(data: CreateUserDTO) {
    try {
      const { data: userData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          user_metadata: {
            name: data.name,
            display_name: data.name,
          },
          app_metadata: {
            role: 'STUDENT',
          },
          email_confirm: true,
        });

      if (authError) {
        Logger.log(authError, 'AuthError');
        if (
          authError.message ===
          'A user with this email address has already been registered'
        ) {
          throw new InternalServerErrorException(
            'O email inserido já está cadastrado',
          );
        }
        throw new InternalServerErrorException(authError);
      }

      const userId = userData?.user?.id;

      if (!userId) {
        throw new InternalServerErrorException(
          'Erro ao obter ID do usuário criado',
        );
      }

      await supabaseAdmin.from('profiles').insert({
        id: userId,
        name: data.name,
        role: 'STUDENT',
      });

      const user = await this.usersService.createUser({
        ...data,
        id: userId,
        role: 'STUDENT',
      });

      const { error: claimsError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          app_metadata: {
            role: user.role,
          },
        });

      if (claimsError) {
        console.error('Erro ao atualizar custom claims:', claimsError);
        throw new InternalServerErrorException(
          'Erro ao definir a role do usuário',
        );
      }

      return {
        status: 201,
        message: 'Usuário criado com sucesso',
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
