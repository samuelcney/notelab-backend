import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RecoverPasswordDTO } from 'src/common/classes/dtos/recover-password.dto';
import { supabaseAdmin } from 'src/database/supabase';
import { PasswordRequestRepository } from 'src/repositories/password-request.repo';
import { generateRandomToken } from 'src/utils/generateToken';
import { EmailService } from './email.service';
import { UsersService } from './users.service';

export class PasswordRequestService {
  constructor(
    private readonly passwordRepository: PasswordRequestRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async findAll() {
    return await this.passwordRepository.findAll();
  }

  async recoverPasswordRequest(email: string) {
    try {
      const token = await generateRandomToken(3);

      Logger.log(`Enviando solicitação de recuperação de senha para: ${email}`);
      await this.emailService.sendPasswordRecoveryEmail(email, token);

      await this.passwordRepository.create(email, token);

      return {
        message: 'Solicitação de recuperação de senha enviada com sucesso.',
      };
    } catch (error) {
      Logger.error(`Erro: ${error}`, error);
      throw new BadGatewayException(
        'Erro ao processar solicitação de recuperação de senha. Por favor, tente novamente mais tarde.',
      );
    }
  }

  async validateToken(data: Omit<RecoverPasswordDTO, 'newPassword'>) {
    const request = await this.passwordRepository.findByEmail(data.email);

    if (!request) {
      throw new NotFoundException(
        'Solicitação de recuperação de senha não encontrada.',
      );
    }

    if (request.token !== data.token) {
      throw new BadRequestException(
        'Token inválido. Por favor, solicite uma nova recuperação de senha.',
      );
    }

    if (request.expiresAt < new Date(Date.now())) {
      throw new BadRequestException(
        'Token expirado. Por favor, solicite uma nova recuperação de senha.',
      );
    }

    return {
      status: HttpStatus.OK,
    };
  }

  async resetPassword(data: Omit<RecoverPasswordDTO, 'token'>) {
    const user = await this.usersService.getUserByEmail(data.email);

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado. Por favor, verifique o e-mail.',
      );
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: data.newPassword,
    });

    if (error) {
      throw new BadGatewayException(
        'Erro ao atualizar a senha. Por favor, tente novamente mais tarde.',
      );
    }

    return {
      message: 'Senha atualizada com sucesso.',
    };
  }
}
