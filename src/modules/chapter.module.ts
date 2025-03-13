import { Module } from '@nestjs/common';
import { ChapterService } from '../services/chapter.service';
import { ChapterRepository } from '../repositories/chapter.repo';
import { ChapterController } from 'src/controllers/chapter.controller';
import { CoursesModule } from './course.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  providers: [ChapterService, ChapterRepository],
  controllers: [ChapterController],
  exports: [ChapterService],
})
export class ChapterModule {}
