import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoursesRepository } from 'src/repositories/course.repo';
import { SupabaseStorageService } from 'src/services/supabase-s3.service';
import { CoursesController } from '../controllers/course.controller';
import { CoursesService } from '../services/course.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    CoursesRepository,
    CoursesService,
    JwtService,
    SupabaseStorageService,
  ],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
