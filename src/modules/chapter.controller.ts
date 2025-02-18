import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateModuleDTO } from './dto/create-module.dto';

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

  @Post()
  createModule(@Body() data: CreateModuleDTO) {
    return this.chapterService.createModule(data);
  }
}
