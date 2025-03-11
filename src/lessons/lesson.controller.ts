import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LessonsService } from './lesson.service';
import { CreateLessonDTO } from './dto/create-lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonsService) {}

  @Get()
  getAllModules() {
    return this.lessonService.getAllLessons();
  }

  @Get('/:id')
  getModuleById(@Param('id') id: number) {
    return this.lessonService.getLessonById(Number(id));
  }

  @Get('/module/:id')
  getLessonByModuleId(@Param('id') id: number) {
    return this.lessonService.getLessonByModuleId(Number(id));
  }

  @Post()
  addLesson(@Body() data: CreateLessonDTO) {
    return this.lessonService.addLesson(data);
  }
}
