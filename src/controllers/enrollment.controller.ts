import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EnrollmentService } from '../services/enrollment.service';

@Controller('/enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  getAllEnrollments() {
    return this.enrollmentService.getAllEnrollments();
  }

  @Get('/course/:id')
  getAllEnrollmentsByCourseId(@Param('id') id: number) {
    return this.enrollmentService.getAllEnrollmentsByCourseId(Number(id));
  }

  @Get('/user/:id')
  getAllEnrollmentsByUserId(@Param('id') id: number) {
    return this.enrollmentService.getAllEnrollmentsByUserId(Number(id));
  }

  @Post()
  doTheCourseEnrollment(@Body() data: EnrollmentDTO) {
    return this.enrollmentService.doTheCourseEnrollment(data);
  }
}
