import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateModuleDTO } from 'src/common/classes/schemas/create-module.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ModuleService } from 'src/services/module.service';

@UseGuards(AuthGuard)
@Controller('modules')
export class ChapterController {
  constructor(private readonly chapterService: ModuleService) {}

  @Get()
  getAllModules() {
    return this.chapterService.getAllModules();
  }

  @Get('/:id')
  getModuleById(@Param('id') id: string) {
    return this.chapterService.getModuleById(id);
  }

  @Get('/course/:id')
  getModuleByCourseId(@Param('id') id: string) {
    return this.chapterService.getModuleByCourseId(id);
  }

  @Post()
  createModule(@Body() data: CreateModuleDTO) {
    return this.chapterService.createModule(data);
  }
}
