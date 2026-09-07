import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { StorageService } from '../services/storage.service';
import { ApproveRequestController } from '../controllers/approve-request.controller';
import { ApproveRequestRepository } from '../repositories/approve-request.repo';
import { ApproveRequestService } from '../services/approve-request.service';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ApproveRequestController],
  providers: [
    ApproveRequestService,
    ApproveRequestRepository,
    JwtService,
    StorageService,
  ],
  exports: [ApproveRequestService],
})
export class ApproveRequestModule {}
