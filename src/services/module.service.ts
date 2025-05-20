import { Injectable } from '@nestjs/common';
import { CoursesService } from 'src/services/course.service';
import { CreateModuleDTO } from '../common/classes/schemas/create-module.dto';
import { ChapterRepository as ModuleRepository } from '../repositories/module.repo';

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleRepository: ModuleRepository,
    private readonly courseService: CoursesService,
  ) {}

  async getAllModules() {
    return await this.moduleRepository.findAll();
  }

  async getModuleById(id: string) {
    return await this.moduleRepository.findById(id);
  }

  async getModuleByCourseId(courseId: string) {
    return await this.moduleRepository.findByCourseId(courseId);
  }

  async createModule(data: CreateModuleDTO) {
    await this.courseService.getCourseById(data.courseId);

    return await this.moduleRepository.create(data);
  }
}
