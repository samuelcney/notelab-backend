import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/course/course.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { ChapterRepository } from './chapter.repo';

@Module({
  imports: [PrismaModule, CoursesModule],
  providers: [ChapterService, ChapterRepository],
  controllers: [ChapterController],
  exports: [ChapterService, ChapterRepository],
})
export class ChapterModule {}
