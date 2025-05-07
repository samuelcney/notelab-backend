import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCourseDTO } from '../common/classes/schemas/create-course.dto';
import { CoursesService } from '../services/course.service';

@Controller('/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get('/:id')
  getCourseById(@Param('id') id: number) {
    return this.coursesService.getCourseById(Number(id));
  }

  @Post()
  addCourse(@Body() data: CreateCourseDTO) {
    return this.coursesService.addCourse(data);
  }

  @Put('/:id')
  updateCourse(@Body() data: CreateCourseDTO, @Param('id') id: number) {
    return this.coursesService.updateCourse(Number(id), data);
  }
}
