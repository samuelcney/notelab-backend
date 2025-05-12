import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoursesModule } from 'src/modules/course.module';
import { UsersModule } from 'src/modules/users.module';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { EnrollmentRepository } from '../repositories/enrollment.repo';
import { EnrollmentService } from '../services/enrollment.service';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule, CoursesModule, UsersModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, EnrollmentRepository, JwtService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
