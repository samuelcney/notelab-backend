import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonsRepository } from './lesson.repo';
import { CreateLessonDTO } from './dto/create-lesson.dto';
import { ChapterRepository } from 'src/modules/chapter.repo';

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonRepository: LessonsRepository,
    private readonly chapterRepository: ChapterRepository,
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
    const existModule = await this.chapterRepository.findById(data.moduleId);

    if (!existModule) {
      throw new NotFoundException(
        `O módulo com o ID ${data.moduleId} não foi encontrado`,
      );
    }

    return await this.lessonRepository.create(data);
  }
}
