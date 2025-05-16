import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateCourseDTO } from '../common/classes/schemas/create-course.dto';
import { CoursesService } from '../services/course.service';

@UseGuards(AuthGuard)
@Controller('/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async getAllCourses() {
    try {
      return await this.coursesService.getAllCourses();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar cursos.');
    }
  }

  @Get('/:id')
  async getCourseById(@Param('id') id: number) {
    try {
      const course = await this.coursesService.getCourseById(Number(id));
      if (!course) {
        throw new NotFoundException('Curso não encontrado.');
      }
      return course;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Erro ao buscar curso por ID.');
    }
  }

  @Get('/instructor/:instructorId')
  async getCourseByInstructorId(@Param('instructorId') instructorId: string) {
    try {
      const courses =
        await this.coursesService.getCourseByInstructorId(instructorId);
      return courses;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao buscar cursos do instrutor.',
      );
    }
  }

  @Post()
  async addCourse(@Body() data: CreateCourseDTO) {
    try {
      return await this.coursesService.addCourse(data);
    } catch (error) {
      throw new BadRequestException('Erro ao criar curso.');
    }
  }

  @Put('/:id')
  async updateCourse(@Body() data: CreateCourseDTO, @Param('id') id: number) {
    try {
      const updated = await this.coursesService.updateCourse(Number(id), data);
      if (!updated) {
        throw new NotFoundException('Curso não encontrado para atualização.');
      }
      return updated;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar curso.');
    }
  }
}
