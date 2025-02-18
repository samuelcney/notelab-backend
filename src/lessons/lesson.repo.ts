import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDTO } from './dto/create-lesson.dto';

@Injectable()
export class LessonsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.lesson.findMany();
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
    });

    return newLesson;
  }
}
