import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UsersController } from 'src/controllers/users.controller';
import { UsersRepository } from 'src/repositories/users.repo';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
