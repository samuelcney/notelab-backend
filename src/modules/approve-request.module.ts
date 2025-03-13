import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users.module';
import { ApproveRequestController } from '../controllers/approve-request.controller';
import { ApproveRequestService } from '../services/approve-request.service';
import { ApproveRequestRepository } from '../repositories/approve-request.repo';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ApproveRequestController],
  providers: [ApproveRequestService, ApproveRequestRepository],
  exports: [ApproveRequestService],
})
export class ApproveRequestModule {}
