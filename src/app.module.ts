import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  ApproveRequestModule,
  AuthModule,
  CartModule,
  CategoryModule,
  ChapterModule,
  CoursesModule,
  EnrollmentModule,
  LessonModule,
  PrismaModule,
  UsersModule,
} from './modules/index';

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
  ],
  controllers: [AppController],
})
export class AppModule {}
