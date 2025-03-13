import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDTO } from '../common/dtos/create-course.dto';
import { CoursesRepository } from 'src/repositories/course.repo';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async getAllCourses() {
    return await this.coursesRepository.findAll();
  }

  async getCourseById(id: number) {
    const existCourse = await this.coursesRepository.findById(id);

    if (!existCourse) {
      throw new NotFoundException(`O curso com o ID ${id} não foi encontrado`);
    }

    return existCourse;
  }

  async addCourse(data: CreateCourseDTO) {
    return await this.coursesRepository.create(data);
  }

  async updateCourse(id: number, data: Partial<CreateCourseDTO>) {
    return await this.coursesRepository.update(id, data);
  }
}
