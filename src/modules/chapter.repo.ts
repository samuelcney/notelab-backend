import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuleDTO } from './dto/create-module.dto';

@Injectable()
export class ChapterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.module.findMany();
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
}
