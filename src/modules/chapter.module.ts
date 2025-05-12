import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChapterController } from 'src/controllers/chapter.controller';
import { ChapterRepository } from '../repositories/chapter.repo';
import { ChapterService } from '../services/chapter.service';
import { CoursesModule } from './course.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  providers: [ChapterService, ChapterRepository, JwtService],
  controllers: [ChapterController],
  exports: [ChapterService],
})
export class ChapterModule {}
