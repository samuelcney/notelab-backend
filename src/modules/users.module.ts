import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from '@/controllers/users.controller';
import { UsersRepository } from '@/repositories/users.repo';
import { StorageService } from '@/services/storage.service';
import { UsersService } from '../services/users.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtService, StorageService],
  exports: [UsersService],
})
export class UsersModule {}
