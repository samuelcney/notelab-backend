import { Module } from '@nestjs/common';
import {
  AuthModule,
  CartModule,
  CategoryModule,
  ChapterModule,
  CoursesModule,
  EmailModule,
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
    CartModule,
    PasswordRequestModule,
    EmailModule,
  ],
})
export class AppModule {}
