import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentDTO } from 'src/common/classes/dtos/add-enrollment.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
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
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
