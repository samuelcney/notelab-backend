import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApproveRequestModule } from './modules/approve-request.module';
import { AuthModule } from './modules/auth.module';
import { CategoryModule } from './modules/categories.module';
import { ChapterModule } from './modules/chapter.module';
import { CoursesModule } from './modules/course.module';
import { EnrollmentModule } from './modules/enrollment.module';
import { LessonModule } from './modules/lesson.module';
import { PrismaModule } from './modules/prisma.module';
import { UsersModule } from './modules/users.module';

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
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
