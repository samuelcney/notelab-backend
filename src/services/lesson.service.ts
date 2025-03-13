import { Injectable } from '@nestjs/common';
import { CreateLessonDTO } from '../common/dtos/create-lesson.dto';
import { ChapterService } from 'src/services/chapter.service';
import { LessonsRepository } from 'src/repositories/lesson.repo';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonRepository: LessonsRepository,
    private readonly chapterService: ChapterService,
  ) {}

  async getAllLessons() {
    return await this.lessonRepository.findAll();
  }

  async getLessonById(id: number) {
    return await this.lessonRepository.findById(id);
  }

  async getLessonByModuleId(courseId: number) {
    return await this.lessonRepository.findByModuleId(courseId);
  }

  async addLesson(data: CreateLessonDTO) {
    await this.chapterService.getModuleById(data.moduleId);

    return await this.lessonRepository.create(data);
  }
}
