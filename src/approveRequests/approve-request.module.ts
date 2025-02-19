import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ApproveRequestController } from './approve-request.controller';
import { ApproveRequestService } from './approve-request.service';
import { ApproveRequestRepository } from './approve-request.repo';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ApproveRequestController],
  providers: [ApproveRequestService, ApproveRequestRepository],
  exports: [ApproveRequestService],
})
export class ApproveRequestModule {}
