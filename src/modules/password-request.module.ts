import { Module } from '@nestjs/common';
import { PasswordRequestRepository } from 'src/repositories/password-request.repo';
import { PasswordRequestService } from 'src/services/password-request.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PasswordRequestRepository],
  exports: [PasswordRequestService],
})
export class PasswordRequestModule {}
