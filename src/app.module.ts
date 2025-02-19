import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { MusicGenderModule } from './musicGender/musicGender.module';
import { CoursesModule } from './course/course.module';
import { AuthModule } from './login/auth.module';
import { ChapterModule } from './modules/chapter.module';
import { LessonModule } from './lessons/lesson.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    InstrumentsModule,
    MusicGenderModule,
    CoursesModule,
    AuthModule,
    ChapterModule,
    LessonModule,
    EnrollmentModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
