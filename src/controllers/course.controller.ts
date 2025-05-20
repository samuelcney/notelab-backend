import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
  async getCourseById(@Param('id') id: string) {
    try {
      const course = await this.coursesService.getCourseById(id);
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
      Logger.log(data, 'COURSE');
      return await this.coursesService.addCourse(data);
    } catch (error) {
      Logger.error(error, 'COURSE');
      throw new BadRequestException('Erro ao criar curso.');
    }
  }

  @Put('/:id')
  async updateCourse(@Body() data: CreateCourseDTO, @Param('id') id: string) {
    try {
      const updated = await this.coursesService.updateCourse(id, data);
      if (!updated) {
        throw new NotFoundException('Curso não encontrado para atualização.');
      }
      return updated;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar curso.');
    }
  }

  @Delete('/:id')
  async deleteCourse(@Param('id') id: string) {
    try {
      const deleted = await this.coursesService.deleteCourse(id);
      if (!deleted) {
        throw new NotFoundException('Curso não encontrado para exclusão.');
      }
      return deleted;
    } catch (error) {
      Logger.error(error, 'COURSE');
      throw new InternalServerErrorException('Erro ao excluir curso.');
    }
  }
}
