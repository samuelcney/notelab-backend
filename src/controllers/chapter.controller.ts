import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateModuleDTO } from 'src/common/classes/schemas/create-module.dto';
import { ChapterService } from 'src/services/chapter.service';

@Controller('modules')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  getAllModules() {
    return this.chapterService.getAllModules();
  }

  @Get('/:id')
  getModuleById(@Param('id') id: number) {
    return this.chapterService.getModuleById(Number(id));
  }

  @Get('/course/:id')
  getModuleByCourseId(@Param('id') id: number) {
    return this.chapterService.getModuleByCourseId(Number(id));
  }

  @Post()
  createModule(@Body() data: CreateModuleDTO) {
    return this.chapterService.createModule(data);
  }
}
