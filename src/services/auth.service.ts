import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { configDotenv } from 'dotenv';
import { ChangePasswordDTO } from 'src/common/classes/dtos/change-password.dto';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { LoginDTO } from 'src/common/classes/schemas/login.dto';
import { supabase, supabaseAdmin } from 'src/database/supabase';
import { UsersService } from 'src/services/users.service';

configDotenv();

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(data: LoginDTO) {
    const user = await this.usersService.getUserByEmail(data.email);

    if (user.isActive === false) {
      throw new UnauthorizedException(
        'Sua conta está inativa. Entre em contato com o suporte.',
      );
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      status: HttpStatus.OK,
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
        status: HttpStatus.CREATED,
        message: 'Usuário criado com sucesso',
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changePassword(data: ChangePasswordDTO) {
    const session = await supabase.auth.getSession();
    const email = session.data.session?.user.email;

    if (!email) {
      throw new Error('Usuário não autenticado.');
    }

    const { error: signInError, data: login } =
      await supabase.auth.signInWithPassword({
        email: email,
        password: data.currentPassword,
      });

    if (signInError) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const { data: user, error: userError } = await supabase.auth.getUser();

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (updateError) {
      throw new Error('Erro ao atualizar a senha: ' + updateError.message);
    }

    return {
      session: {
        access_token: login.session.access_token,
        user,
      },
      message: 'Senha alterada com sucesso!',
    };
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
