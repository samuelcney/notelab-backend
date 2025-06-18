import { Module } from '@nestjs/common';
import { PasswordRequestController } from 'src/controllers/password-request.controller';
import { PasswordRequestRepository } from 'src/repositories/password-request.repo';
import { EmailService } from 'src/services/email.service';
import { PasswordRequestService } from 'src/services/password-request.service';
import { EmailModule } from './email.module';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users.module';

@Module({
  imports: [PrismaModule, UsersModule, EmailModule],
  controllers: [PasswordRequestController],
  providers: [PasswordRequestRepository, PasswordRequestService, EmailService],
})
export class PasswordRequestModule {}
