import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './course.repo';
import { CreateCourseDTO } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async getAllCourses() {
    return await this.coursesRepository.findAll();
  }

  async addCourse(data: CreateCourseDTO) {
    return await this.coursesRepository.create(data);
  }
}
