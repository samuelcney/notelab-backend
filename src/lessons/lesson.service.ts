import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsRepository } from './lesson.repo';
import { CreateLessonDTO } from './dto/create-lesson.dto';
import { ChapterRepository } from 'src/modules/chapter.repo';
import { ChapterService } from 'src/modules/chapter.service';

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
