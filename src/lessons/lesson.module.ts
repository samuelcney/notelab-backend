import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LessonsService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { LessonsRepository } from './lesson.repo';
import { ChapterModule } from 'src/modules/chapter.module';

@Module({
  imports: [PrismaModule, ChapterModule],
  providers: [LessonsService, LessonsRepository],
  controllers: [LessonController],
  exports: [LessonsService],
})
export class LessonModule {}
