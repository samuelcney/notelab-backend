import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { MusicGenderModule } from './musicGender/musicGender.module';
import { CoursesModule } from './course/course.module';
import { AuthModule } from './login/auth.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    InstrumentsModule,
    MusicGenderModule,
    CoursesModule,
    AuthModule,
  ],
})
export class AppModule {}
