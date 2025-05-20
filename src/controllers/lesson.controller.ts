import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateLessonDTO } from 'src/common/classes/schemas/create-lesson.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LessonsService } from 'src/services/lesson.service';

@UseGuards(AuthGuard)
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonsService) {}

  @Get()
  getAllLessons() {
    return this.lessonService.getAllLessons();
  }

  @Get('/:id')
  getLessonById(@Param('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @Get('/module/:id')
  getLessonByModuleId(@Param('id') id: string) {
    return this.lessonService.getLessonByModuleId(id);
  }

  @Post()
  addLesson(@Body() data: CreateLessonDTO) {
    return this.lessonService.addLesson(data);
  }
}
