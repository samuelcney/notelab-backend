import { Injectable } from '@nestjs/common';
import { CoursesService } from 'src/services/course.service';
import { CreateModuleDTO } from '../common/classes/schemas/create-module.dto';
import { ChapterRepository } from '../repositories/chapter.repo';

@Injectable()
export class ChapterService {
  constructor(
    private readonly chapterRepository: ChapterRepository,
    private readonly courseService: CoursesService,
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
    await this.courseService.getCourseById(data.courseId);

    return await this.chapterRepository.create(data);
  }
}
