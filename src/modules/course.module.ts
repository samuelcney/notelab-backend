import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoursesRepository } from 'src/repositories/course.repo';
import { CoursesController } from '../controllers/course.controller';
import { CoursesService } from '../services/course.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CoursesRepository, CoursesService, JwtService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
