import { Module } from '@nestjs/common';
import { CoursesService } from '../services/course.service';
import { CoursesController } from '../controllers/course.controller';
import { CoursesRepository } from 'src/repositories/course.repo';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CoursesRepository, CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
