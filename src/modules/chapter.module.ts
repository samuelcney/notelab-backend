import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChapterController } from 'src/controllers/module.controller';
import { ChapterRepository } from '../repositories/module.repo';
import { ModuleService } from '../services/module.service';
import { CoursesModule } from './course.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule],
  providers: [ModuleService, ChapterRepository, JwtService],
  controllers: [ChapterController],
  exports: [ModuleService],
})
export class ChapterModule {}
