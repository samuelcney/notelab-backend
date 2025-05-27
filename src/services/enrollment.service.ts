import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getEnrollmentById(id: string) {
    return await this.enrollmentRepository.findById(id);
  }

  async getAllEnrollmentsByCourseId(courseId: string) {
    await this.courseService.getCourseById(courseId);

    return this.enrollmentRepository.findAllByCourseId(courseId);
  }

  async getAllEnrollmentsByUserId(userId: string) {
    await this.usersService.getUserById(userId);

    return this.enrollmentRepository.findAllByUserId(userId);
  }

  async registerCourseEnrollment(data: EnrollmentDTO) {
    const existsUser = await this.usersService.getUserById(data.userId);
    const existsCourse = this.courseService.getCourseById(data.courseId);

    if (!existsUser) {
      throw new NotFoundException(`O usuário com ID ${data.userId} não existe`);
    }

    if (!existsCourse) {
      throw new NotFoundException(`O curso com ID ${data.courseId} não existe`);
    }

    return await this.enrollmentRepository.doEnrollment(data);
  }
}
