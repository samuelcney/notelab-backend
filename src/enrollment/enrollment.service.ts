import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollmentRepository } from './enrollment.repo';
import { CoursesService } from 'src/course/course.service';
import { UsersService } from 'src/users/users.service';

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

  async getAllEnrollmentsByUserId(userId: number) {
    await this.usersService.getUserById(userId);

    return this.enrollmentRepository.findAllByUserId(userId);
  }

  async doTheCourseEnrollment(data: EnrollmentDTO) {
    await this.usersService.getUserById(data.userId);
    await this.courseService.getCourseById(data.courseId);

    return await this.enrollmentRepository.doEnrollment(data);
  }
}
