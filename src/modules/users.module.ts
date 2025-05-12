import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from 'src/controllers/users.controller';
import { UsersRepository } from 'src/repositories/users.repo';
import { SupabaseStorageService } from 'src/services/supabase-s3.service';
import { UsersService } from '../services/users.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    JwtService,
    SupabaseStorageService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
