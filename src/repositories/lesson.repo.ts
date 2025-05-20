import { Injectable } from '@nestjs/common';
import { CreateLessonDTO } from 'src/common/classes/schemas/create-lesson.dto';
import { PrismaService } from 'src/database/prisma.service';

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

  async findById(id: string) {
    return await this.prisma.lesson.findUnique({
      where: {
        id,
      },
    });
  }

  async findByModuleId(moduleId: string) {
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
        videoUrl: data.videoUrl,
        duration: data.duration,
        moduleId: data.moduleId,
      },
      include: {
        module: true,
      },
    });

    return newLesson;
  }

  async delete(id: string) {
    return await this.prisma.lesson.delete({
      where: {
        id,
      },
    });
  }
}
