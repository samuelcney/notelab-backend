import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from 'src/controllers/users.controller';
import { SupabaseStorageService } from 'src/database/supabase-s3.service';
import { UsersRepository } from 'src/repositories/users.repo';
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
