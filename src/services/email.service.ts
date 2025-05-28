import { BadGatewayException, Injectable } from '@nestjs/common';
import { resend } from 'src/config/resend-config';
import { renderEmailTemplate } from 'src/utils/emailTemplate';
import { PasswordRequestService } from './password-request.service';

@Injectable()
export class EmailService {
  constructor(private readonly passwordService: PasswordRequestService) {}

  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    const token = await this.passwordService.generateToken(3);

    try {
      await this.passwordService.create(email, token);
    } catch (error: any) {
      throw new BadGatewayException(
        'Erro ao criar solicitação de recuperação de senha',
        error,
      );
    }

    const { error } = await resend.emails.send({
      from: 'Notelab <noreply@resend.dev>',
      to: email,
      subject: 'Recuperação de senha - Notelab',
      html: renderEmailTemplate('reset-password', {
        token: String(token),
      }),
    });

    if (error) {
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }
  }
}
