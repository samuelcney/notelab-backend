import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
  };

  async findAll() {
    return await this.prisma.enrollment.findMany({
      include: {
        course: {
          include: {
            instructor: {
              select: this.userSelect,
            },
          },
        },
        user: {
          select: this.userSelect,
        },
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.enrollment.findUnique({
      where: {
        id,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: this.userSelect,
            },
          },
        },
        user: {
          select: this.userSelect,
        },
      },
    });
  }

  async findAllByCourseId(courseId: string) {
    return await this.prisma.enrollment.findMany({
      where: {
        courseId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: this.userSelect,
            },
          },
        },
      },
    });
  }

  async findAllByUserId(userId: string) {
    const enrrolment = await this.prisma.enrollment.findMany({
      where: {
        userId,
      },
    });

    return enrrolment;
  }

  async doEnrollment(data: { courseId: string; userId: string }) {
    return await this.prisma.enrollment.create({
      data: {
        courseId: data.courseId,
        userId: data.userId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: this.userSelect,
            },
          },
        },
        user: {
          select: this.userSelect,
        },
      },
    });
  }
}
