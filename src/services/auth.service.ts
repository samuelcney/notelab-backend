import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { LoginDTO } from 'src/common/classes/schemas/login.dto';
import { supabase, supabaseAdmin } from 'src/database/supabase';
import { UsersService } from 'src/services/users.service';

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
        Logger.error(authError, 'AuthError');
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
        Logger.error('Erro ao atualizar custom claims:', claimsError);
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

  async requestRecoverPassword(email: string) {
    const userExists = await this.usersService.getUserByEmail(email);

    if (!userExists) {
      throw new NotFoundException('O email inserido não está cadastrado');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      userExists.email,
      {},
    );

    if (error) {
      throw new InternalServerErrorException(
        'Erro ao enviar email de recuperação',
      );
    }

    return {
      status: 200,
      message: 'Email de recuperação enviado com sucesso',
    };
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
