import { Injectable } from '@nestjs/common';
import { CreateLessonDTO } from 'src/common/classes/schemas/create-lesson.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.lesson.findMany({
      include: {
        module: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findById(id: number) {
    return await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });
  }

  async findByModuleId(moduleId: number) {
    return await this.prisma.lesson.findMany({
      where: {
        moduleId,
      },
      orderBy: { id: 'asc' },
    });
  }

  async create(data: CreateLessonDTO) {
    const newLesson = await this.prisma.lesson.create({
      data: {
        title: data.title,
        type: data.type,
        content: data.content,
        moduleId: data.moduleId,
      },
      include: {
        module: true,
      },
    });

    return newLesson;
  }

  async delete(id: number) {
    return await this.prisma.lesson.delete({
      where: {
        id,
      },
    });
  }
}
