import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RecoverPasswordDTO } from 'src/common/classes/dtos/recover-password.dto';
import { supabaseAdmin } from 'src/database/supabase';
import { PasswordRequestRepository } from 'src/repositories/password-request.repo';
import { generateRandomToken } from 'src/utils/generateToken';

import { EmailService } from './email.service';
import { UsersService } from './users.service';

@Injectable()
export class PasswordRequestService {
  constructor(
    private readonly passwordRepository: PasswordRequestRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async findAll() {
    return this.passwordRepository.findAll();
  }

  async recoverPasswordRequest(email: string) {
    try {
      const token = await generateRandomToken(3);
      await this.emailService.sendPasswordRecoveryEmail(email, token);
      await this.passwordRepository.create(email, token);

      return {
        status: HttpStatus.OK,
        message: 'Solicitação de recuperação de senha enviada com sucesso.',
      };
    } catch (error) {
      Logger.error('Erro ao solicitar recuperação de senha', error);
      throw new BadGatewayException(
        'Erro ao processar solicitação de recuperação de senha. Por favor, tente novamente mais tarde.',
      );
    }
  }

  async validateToken({
    email,
    token,
  }: Omit<RecoverPasswordDTO, 'newPassword'>) {
    const request = await this.passwordRepository.findByEmail(email);

    if (!request) {
      throw new NotFoundException(
        'Solicitação de recuperação de senha não encontrada.',
      );
    }

    if (request.token !== token) {
      throw new BadRequestException('Token inválido.');
    }

    if (request.isUsed) {
      throw new BadRequestException(
        'Token já utilizado. Solicite um novo token.',
      );
    }

    if (request.expiresAt < new Date()) {
      throw new BadRequestException(
        'Token expirado. Solicite uma nova recuperação.',
      );
    }

    await this.passwordRepository.updateRequest(request.id);

    return { status: HttpStatus.OK, message: 'Token validado com sucesso.' };
  }

  async resetPassword({
    email,
    newPassword,
  }: Omit<RecoverPasswordDTO, 'token'>) {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado. Verifique o e-mail informado.',
      );
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      Logger.error('Erro ao atualizar senha no Supabase', error);
      throw new BadGatewayException(
        'Erro ao atualizar a senha. Tente novamente.',
      );
    }

    return { status: HttpStatus.OK, message: 'Senha atualizada com sucesso.' };
  }
}
