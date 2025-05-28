import { Module } from '@nestjs/common';
import { EmailController } from 'src/controllers/email.controller';
import { EmailService } from 'src/services/email.service';
import { PasswordRequestService } from 'src/services/password-request.service';

@Module({
  imports: [],
  providers: [EmailService, PasswordRequestService],
  controllers: [EmailController],
})
export class EmailModule {}
