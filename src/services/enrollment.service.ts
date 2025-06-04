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

    if (!existsUser) {
      throw new NotFoundException(`O usuário com ID ${data.userId} não existe`);
    }

    if (Array.isArray(data.courseId)) {
      for (const courseId of data.courseId) {
        const existsCourse = await this.courseService.getCourseById(courseId);
        if (!existsCourse) {
          throw new NotFoundException(`O curso com ID ${courseId} não existe`);
        }
        await this.enrollmentRepository.doEnrollment({
          courseId,
          userId: data.userId,
        });
      }
    } else {
      const existsCourse = await this.courseService.getCourseById(
        data.courseId,
      );
      if (!existsCourse) {
        throw new NotFoundException(
          `O curso com ID ${data.courseId} não existe`,
        );
      }
      await this.enrollmentRepository.doEnrollment({
        userId: data.userId,
        courseId: data.courseId,
      });
    }
  }
}
