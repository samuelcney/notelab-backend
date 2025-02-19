import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.enrollment.findMany({
      include: {
        course: true,
        user: true,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.enrollment.findUnique({
      where: {
        id,
      },
      include: {
        course: true,
        user: true,
      },
    });
  }

  async findAllByCourseId(courseId: number) {
    return await this.prisma.enrollment.findMany({
      where: {
        courseId,
      },
      include: {
        course: true,
        user: true,
      },
    });
  }

  async findAllByUserId(userId: number) {
    return await this.prisma.enrollment.findMany({
      where: {
        userId,
      },
      include: {
        course: true,
        user: true,
      },
    });
  }

  async doEnrollment(data: EnrollmentDTO) {
    return await this.prisma.enrollment.create({
      data: {
        courseId: data.courseId,
        userId: data.userId,
      },
      include: {
        course: true,
        user: true,
      },
    });
  }
}
