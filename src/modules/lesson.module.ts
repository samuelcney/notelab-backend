import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LessonController } from 'src/controllers/lesson.controller';
import { LessonsRepository } from 'src/repositories/lesson.repo';
import { LessonsService } from 'src/services/lesson.service';
import { ChapterModule } from './chapter.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, ChapterModule],
  providers: [LessonsService, LessonsRepository, JwtService],
  controllers: [LessonController],
  exports: [LessonsService],
})
export class LessonModule {}
