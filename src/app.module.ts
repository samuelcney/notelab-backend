import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ApproveRequestModule,
  AuthModule,
  CartModule,
  ChapterModule,
  CoursesModule,
  EnrollmentModule,
  LessonModule,
  PrismaModule,
  UsersModule,
  CategoryModule,
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
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
