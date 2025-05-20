import { Injectable } from '@nestjs/common';
import { EnrollmentDTO } from 'src/common/classes/dtos/add-enrollment.dto';
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
        user: {
          select: this.userSelect,
        },
      },
    });
  }

  async findAllByUserId(userId: string) {
    return await this.prisma.enrollment.findMany({
      where: {
        userId,
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

  async doEnrollment(data: EnrollmentDTO) {
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
