import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateModuleDTO } from '../common/classes/schemas/create-module.dto';

@Injectable()
export class ChapterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.module.findMany({
      include: {
        lessons: true,
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.module.findUnique({
      where: {
        id,
      },
      include: {
        lessons: true,
      },
    });
  }

  async findByCourseId(courseId: number) {
    return await this.prisma.module.findMany({
      where: {
        courseId,
      },
    });
  }

  async create(data: CreateModuleDTO) {
    const newModule = await this.prisma.module.create({
      data: {
        name: data.name,
        courseId: data.courseId,
      },
      include: {
        course: true,
        lessons: true,
      },
    });

    return newModule;
  }

  async delete(id: number) {
    return await this.prisma.module.delete({
      where: {
        id,
      },
    });
  }
}
