import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from 'src/repositories/course.repo';
import { CreateCourseDTO } from '../common/classes/schemas/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async getAllCourses() {
    return await this.coursesRepository.findAll();
  }

  async getCourseById(id: string) {
    const existCourse = await this.coursesRepository.findById(id);

    if (!existCourse) {
      throw new NotFoundException(`O curso com o ID ${id} não foi encontrado`);
    }

    return existCourse;
  }

  async getCourseByInstructorId(instructorId: string) {
    const existCourse =
      await this.coursesRepository.findByInstructorId(instructorId);

    if (!existCourse) {
      throw new NotFoundException(
        `O curso com o ID do instrutor ${instructorId} não foi encontrado`,
      );
    }

    return existCourse;
  }

  async addCourse(data: CreateCourseDTO) {
    return await this.coursesRepository.create(data);
  }

  async uploadCourseImage(courseId: string, url: string) {
    const existCourse = await this.coursesRepository.findById(courseId);

    if (!existCourse) {
      throw new NotFoundException(
        `O curso com o ID ${courseId} não foi encontrado`,
      );
    }

    return await this.coursesRepository.uploadImage(courseId, url);
  }

  async updateCourse(id: string, data: Partial<CreateCourseDTO>) {
    const existCourse = await this.coursesRepository.findById(id);

    if (!existCourse) {
      throw new NotFoundException(`O curso com o ID ${id} não foi encontrado`);
    }

    return await this.coursesRepository.update(id, data);
  }

  async deleteCourse(id: string) {
    const existCourse = await this.coursesRepository.findById(id);

    if (!existCourse) {
      throw new NotFoundException(`O curso com o ID ${id} não foi encontrado`);
    }

    return await this.coursesRepository.delete(id);
  }
}
