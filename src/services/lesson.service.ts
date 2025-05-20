import { Injectable } from '@nestjs/common';
import { LessonsRepository } from 'src/repositories/lesson.repo';
import { ModuleService } from 'src/services/module.service';
import { CreateLessonDTO } from '../common/classes/schemas/create-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonRepository: LessonsRepository,
    private readonly chapterService: ModuleService,
  ) {}

  async getAllLessons() {
    return await this.lessonRepository.findAll();
  }

  async getLessonById(id: string) {
    return await this.lessonRepository.findById(id);
  }

  async getLessonByModuleId(courseId: string) {
    return await this.lessonRepository.findByModuleId(courseId);
  }

  async addLesson(data: CreateLessonDTO) {
    await this.chapterService.getModuleById(data.moduleId);

    return await this.lessonRepository.create(data);
  }
}
