import { Injectable } from '@nestjs/common';
import { getResend } from '@/config/resend-config';
import { renderEmailTemplate } from '@/utils/emailTemplate';

@Injectable()
export class EmailService {
  constructor() {}

  async sendPasswordRecoveryEmail(email: string, token: string) {
    const { error } = await getResend().emails.send({
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
