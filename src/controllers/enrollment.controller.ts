import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentDTO } from '@/common/classes/dtos/add-enrollment.dto';
import { AuthGuard } from '@/common/guards/auth.guard';
import { EnrollmentService } from '../services/enrollment.service';

@UseGuards(AuthGuard)
@Controller('/enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  getAllEnrollments() {
    return this.enrollmentService.getAllEnrollments();
  }

  @Get('/instructor/:id/enrollment-count')
  getEnrollmentCountByInstructorId(@Param('id') id: string) {
    return this.enrollmentService.getEnrollmentCountByInstructorId(id);
  }

  @Get('/user/:id')
  getAllEnrollmentsByUserId(@Param('id') id: string) {
    return this.enrollmentService.getAllEnrollmentsByUserId(id);
  }

  @Post()
  registerCourseEnrollment(@Body() data: EnrollmentDTO) {
    try {
      return this.enrollmentService.registerCourseEnrollment(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao registrar matrícula.';
      throw new BadRequestException(message);
    }
  }
}
