import { Controller, Logger, Param, Post } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';

@Controller('send-email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('password-recovery/:email')
  recoverPassword(@Param('email') email: string) {
    Logger.log(`Request to recover password for email: ${email}`, 'EMAIL');
    return this.emailService.sendPasswordRecoveryEmail(email);
  }
}
