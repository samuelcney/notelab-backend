import { Controller, Get, Param } from '@nestjs/common';
import { ChapterService } from './chapter.service';

@Controller('modules')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  getAllModules() {
    return this.chapterService.getAllModules();
  }

  @Get('/:id')
  getModuleById(@Param('id') id: number) {
    return this.chapterService.getModuleById(id);
  }

  @Get('/course/:id')
  getModuleByCourseId(@Param('id') id: number) {
    return this.chapterService.getModuleByCourseId(id);
  }
}
