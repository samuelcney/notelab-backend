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

  @Get('/:id')
  getCourseById(@Param('id') id: number) {
    return this.coursesService.getCourseById(Number(id));
  }

  @Post()
  addCourse(@Body() data: CreateCourseDTO) {
    return this.coursesService.addCourse(data);
  }
}
