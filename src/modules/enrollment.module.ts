import { Module } from '@nestjs/common';
import { CoursesModule } from 'src/modules/course.module';
import { UsersModule } from 'src/modules/users.module';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { EnrollmentService } from '../services/enrollment.service';
import { EnrollmentRepository } from '../repositories/enrollment.repo';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule, UsersModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
