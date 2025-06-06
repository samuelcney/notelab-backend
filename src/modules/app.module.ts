import { Module } from '@nestjs/common';
import {
  ApproveRequestModule,
  AuthModule,
  CartModule,
  CategoryModule,
  ChapterModule,
  CoursesModule,
  EnrollmentModule,
  LessonModule,
  PasswordRequestModule,
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
    PasswordRequestModule,
  ],
})
export class AppModule {}
