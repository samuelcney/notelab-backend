import { Module } from '@nestjs/common';
import {
  ApproveRequestModule,
  AuthModule,
  CartModule,
  CategoryModule,
  ChapterModule,
  CoursesModule,
  EmailModule,
  EnrollmentModule,
  LessonModule,
  PrismaModule,
  UsersModule,
} from './index';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CategoryModule,
    CoursesModule,
    AuthModule,
    ChapterModule,
    LessonModule,
    EnrollmentModule,
    ApproveRequestModule,
    CartModule,
    EmailModule,
  ],
})
export class AppModule {}
