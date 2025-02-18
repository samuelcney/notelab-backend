import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { AddMaterialToCourseDTO } from './dto/add-material.dto';

@Injectable()
export class CoursesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.course.findMany({
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
        hasInstruments: {
          include: {
            instrument: true,
          },
        },
        hasMusicGender: {
          include: {
            musicGender: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.course.findUnique({
      where: {
        id,
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

        hasInstruments: {
          create:
            data.hasInstruments?.map(instrument => ({
              instrumentId: instrument.instrumentId,
            })) || [],
        },

        hasMusicGender: {
          create:
            data.hasMusicGender?.map(gender => ({
              genderId: gender.genderId,
            })) || [],
        },
      },
      include: {
        hasInstruments: true,
        hasMusicGender: true,
      },
    });

    return newCourse;
  }
}
