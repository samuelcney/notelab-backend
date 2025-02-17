import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './course.repo';
import { CreateCourseDTO } from './dto/create-course.dto';
import { AddMaterialToCourseDTO } from './dto/add-material.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async getAllCourses() {
    return await this.coursesRepository.findAll();
  }

  async addCourse(data: CreateCourseDTO) {
    return await this.coursesRepository.create(data);
  }

  async addMaterialToCourse(courseId: number, data: AddMaterialToCourseDTO) {
    return await this.coursesRepository.addMaterial(courseId, data);
  }
}
