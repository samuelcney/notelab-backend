import { Injectable } from '@nestjs/common';
import { CreateCourseDTO } from 'src/common/classes/schemas/create-course.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
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
          select: {
            category: true,
          },
        },
      },
    });

    return courses.map(course => ({
      ...course,
      categories: course.categories.map(cat => cat.category) || [],
    }));
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        categories: {
          select: {
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
            lessons: {
              orderBy: { id: 'asc' },
            },
          },
        },
      },
    });

    return {
      ...course,
      categories: course?.categories.map(cat => cat.category) || [],
    };
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
              categoryId: category,
            })) || [],
        },

        modules: {
          create: data.modules.map(module => ({
            name: module.title,
            lessons: {
              create: module.lessons.map(lesson => ({
                title: lesson.title,
                videoUrl: lesson.videoUrl,
                description: lesson.description,
              })),
            },
          })),
        },
      },
      include: {
        categories: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return newCourse;
  }

  async uploadImage(courseId: string, url: string) {
    await this.prisma.course.update({
      where: { id: courseId },
      data: { coverImage: url },
    });
  }

  async update(id: string, data: Partial<CreateCourseDTO>) {
    const updateData: any = {
      ...Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
      ),
      categories: data.categories
        ? {
            deleteMany: {},
            create: data.categories.map(category => ({
              categoryId: category,
            })),
          }
        : undefined,
    };

    if (data.modules) {
      updateData.modules = {
        deleteMany: {},
        create: data.modules.map(module => ({
          name: module.title,
          lessons: {
            create: module.lessons.map(lesson => ({
              title: lesson.title,
              videoUrl: lesson.videoUrl,
              description: lesson.description,
            })),
          },
        })),
      };
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return updatedCourse;
  }

  async findByInstructorId(instructorId: string) {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
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
          select: {
            category: true,
          },
        },
      },
    });

    return courses.map(course => ({
      ...course,
      categories: course.categories.map(cat => cat.category) || [],
    }));
  }

  async delete(id: string) {
    await this.prisma.module.deleteMany({
      where: { courseId: id },
    });

    const deletedCourse = await this.prisma.course.delete({
      where: { id },
    });

    return deletedCourse;
  }
}
