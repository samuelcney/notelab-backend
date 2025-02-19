import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/course/course.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentRepository } from './enrollment.repo';

@Module({
  imports: [PrismaModule, CoursesModule, UsersModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
