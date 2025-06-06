import { Injectable } from '@nestjs/common';
import { resend } from 'src/config/resend-config';
import { renderEmailTemplate } from 'src/utils/emailTemplate';

@Injectable()
export class EmailService {
  constructor() {}

  async sendPasswordRecoveryEmail(email: string, token: string): Promise<void> {
    const { error } = await resend.emails.send({
      from: 'Notelab <noreply@resend.dev>',
      to: email,
      subject: 'Recuperação de senha - Notelab',
      html: renderEmailTemplate('reset-password', {
        token,
      }),
    });

    if (error) {
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }
  }
}
