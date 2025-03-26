import { Injectable } from '@nestjs/common';
import { CreateCourseDTO } from 'src/common/classes/dtos/create-course.dto';
import { PrismaService } from 'src/services/prisma.service';

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
            lessons: true,
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
            lessons: true,
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

  async update(id: number, data: Partial<CreateCourseDTO>) {
    return await this.prisma.course.update({
      where: { id },
      data: {
        ...Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== undefined),
        ),
        categories: data.categories
          ? {
              deleteMany: {},
              create: data.categories.map(category => ({
                categoryId: category.categoryId,
              })),
            }
          : undefined,
      },
      include: {
        categories: true,
      },
    });
  }
}
