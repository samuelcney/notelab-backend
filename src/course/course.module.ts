import { Module } from '@nestjs/common';
import { CoursesRepository } from './course.repo';
import { CoursesService } from './course.service';
import { CoursesController } from './course.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CoursesRepository, CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
