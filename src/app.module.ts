import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './course/course.module';
import { AuthModule } from './login/auth.module';
import { ChapterModule } from './modules/chapter.module';
import { LessonModule } from './lessons/lesson.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ApproveRequestModule } from './approveRequests/approve-request.module';
import { CategoryModule } from './categories/categories.module';

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
