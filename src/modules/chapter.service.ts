import { Injectable, NotFoundException } from '@nestjs/common';
import { ChapterRepository } from './chapter.repo';
import { CoursesRepository } from 'src/course/course.repo';
import { CreateModuleDTO } from './dto/create-module.dto';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepository: ChapterRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  async getAllModules() {
    return await this.chapterRepository.findAll();
  }

  async getModuleById(id: number) {
    return await this.chapterRepository.findById(id);
  }

  async getModuleByCourseId(courseId: number) {
    return await this.chapterRepository.findByCourseId(courseId);
  }

  async createModule(data: CreateModuleDTO) {
    const existCourse = await this.coursesRepository.findById(data.courseId);

    if (!existCourse) {
      throw new NotFoundException(
        `O curso com o ID ${data.courseId} não foi encontrado`,
      );
    }

    return await this.chapterRepository.create(data);
  }
}
