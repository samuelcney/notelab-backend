import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLessonDTO } from 'src/common/classes/dtos/create-lesson.dto';
import { LessonsService } from 'src/services/lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonsService) {}

  @Get()
  getAllLessons() {
    return this.lessonService.getAllLessons();
  }

  @Get('/:id')
  getLessonById(@Param('id') id: number) {
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
