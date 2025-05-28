import { Injectable } from '@nestjs/common';
import { resend } from 'src/config/resend-config';
import { renderEmailTemplate } from 'src/utils/email-template';
import { generateRandomToken } from 'src/utils/generateToken';

@Injectable()
export class EmailService {
  constructor() {}

  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    const { error } = await resend.emails.send({
      from: 'Notelab <noreply@resend.dev>',
      to: email,
      subject: 'Recuperação de senha - Notelab',
      html: renderEmailTemplate('reset-password', {
        token: generateRandomToken(3),
      }),
    });

    if (error) {
      throw new Error(`Erro ao enviar email: ${error.message}`);
    }
  }
}
