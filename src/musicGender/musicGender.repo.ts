import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MusicGenderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.musicGender.findMany();
  }

  async findById(id: number) {
    return await this.prisma.musicGender.findUnique({
      where: {
        id,
      },
    });
  }

  async create(description: string) {
    return await this.prisma.musicGender.create({
      data: {
        description,
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.musicGender.delete({
      where: {
        id,
      },
    });
  }
}
