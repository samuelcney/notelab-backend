import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoursesRepository } from '@/repositories/course.repo';
import { StorageService } from '@/services/storage.service';
import { CoursesController } from '../controllers/course.controller';
import { CoursesService } from '../services/course.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CoursesRepository, CoursesService, JwtService, StorageService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
