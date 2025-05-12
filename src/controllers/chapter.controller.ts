import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateModuleDTO } from 'src/common/classes/schemas/create-module.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChapterService } from 'src/services/chapter.service';

@UseGuards(AuthGuard)
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
