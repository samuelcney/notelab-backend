import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDTO } from './dto/create-course.dto';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        modules: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.course.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async create(data: CreateCourseDTO) {
    const newCourse = await this.prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        difficulty: data.difficulty,
        instructorId: data.instructorId,

        categories: {
          create:
            data.categories?.map(category => ({
              categoryId: category.categoryId,
            })) || [],
        },
      },
      include: {
        categories: true,
      },
    });

    return newCourse;
  }
}
