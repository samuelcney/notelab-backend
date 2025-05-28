import {
  BadRequestException,
  Controller,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { EmailService } from 'src/services/email.service';

@Controller('send-email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('password-recovery/:email')
  recoverPassword(@Param('email') email: string) {
    try {
      Logger.log(`Request to recover password for email: ${email}`, 'EMAIL');
      const req = this.emailService.sendPasswordRecoveryEmail(email);

      return {
        message: 'Email de recuperação enviado com sucesso',
        request: req,
      };
    } catch (error) {
      throw new BadRequestException(
        'Erro ao enviar email de recuperação de senha',
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    }
  }
}
