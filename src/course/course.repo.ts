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
        CourseMaterial: true,
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

        CourseMaterial: {
          create:
            data.courseMaterials?.map(material => ({
              title: material.title,
              type: material.type,
              content: material.content,
            })) || [],
        },
      },
      include: {
        hasInstruments: true,
        hasMusicGender: true,
        CourseMaterial: true,
      },
    });

    return newCourse;
  }

  async addMaterial(id: number, data: AddMaterialToCourseDTO) {
    return await this.prisma.course.update({
      where: { id },
      data: {
        CourseMaterial: {
          create: data.courseMaterials.map(material => ({
            title: material.title,
            type: material.type,
            content: material.content,
          })),
        },
      },
      include: {
        CourseMaterial: true,
      },
    });
  }
}
