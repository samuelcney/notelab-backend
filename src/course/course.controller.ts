import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CoursesService } from './course.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { AddMaterialToCourseDTO } from './dto/add-material.dto';

@Controller('/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Post()
  addCourse(@Body() data: CreateCourseDTO) {
    return this.coursesService.addCourse(data);
  }

  @Put('/:id')
  addMaterialToCourse(
    @Param('id') courseId: number,
    @Body() data: AddMaterialToCourseDTO,
  ) {
    return this.coursesService.addMaterialToCourse(courseId, data);
  }
}
