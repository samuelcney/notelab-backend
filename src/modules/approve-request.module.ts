import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users.module';
import { SupabaseStorageService } from 'src/services/supabase-s3.service';
import { ApproveRequestController } from '../controllers/approve-request.controller';
import { ApproveRequestRepository } from '../repositories/approve-request.repo';
import { ApproveRequestService } from '../services/approve-request.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ApproveRequestController],
  providers: [
    ApproveRequestService,
    ApproveRequestRepository,
    JwtService,
    SupabaseStorageService,
  ],
  exports: [ApproveRequestService],
})
export class ApproveRequestModule {}
