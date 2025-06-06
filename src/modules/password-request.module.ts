import { Module } from '@nestjs/common';
import { PasswordRequestController } from 'src/controllers/password-request.controller';
import { PasswordRequestRepository } from 'src/repositories/password-request.repo';
import { EmailService } from 'src/services/email.service';
import { PasswordRequestService } from 'src/services/password-request.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PasswordRequestController],
  providers: [PasswordRequestRepository, PasswordRequestService, EmailService],
  exports: [],
})
export class PasswordRequestModule {}
