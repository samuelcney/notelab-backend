import { Injectable } from '@nestjs/common';
import { EnrollmentDTO } from 'src/common/classes/dtos/add-enrollment.dto';
import { CoursesService } from 'src/services/course.service';
import { UsersService } from 'src/services/users.service';
import { EnrollmentRepository } from '../repositories/enrollment.repo';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly courseService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async getAllEnrollments() {
    return await this.enrollmentRepository.findAll();
  }

  async getEnrollmentById(id: number) {
    return await this.enrollmentRepository.findById(id);
  }

  async getAllEnrollmentsByCourseId(courseId: number) {
    await this.courseService.getCourseById(courseId);

    return this.enrollmentRepository.findAllByCourseId(courseId);
  }

  async getAllEnrollmentsByUserId(userId: string) {
    await this.usersService.getUserById(userId);

    return this.enrollmentRepository.findAllByUserId(userId);
  }

  async doTheCourseEnrollment(data: EnrollmentDTO) {
    await this.usersService.getUserById(data.userId);
    await this.courseService.getCourseById(data.courseId);

    return await this.enrollmentRepository.doEnrollment(data);
  }
}
