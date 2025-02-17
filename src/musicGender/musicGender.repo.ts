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

  async findByDescription(desc: string) {
    return await this.prisma.musicGender.findFirst({
      where: {
        description: desc,
      },
    });
  }

  async create(data: MusicGenderType) {
    return await this.prisma.musicGender.create({
      data: {
        description: data.description,
      },
    });
  }

  async update(id: number, data: MusicGenderType) {
    return await this.prisma.musicGender.update({
      data: {
        description: data.description,
      },
      where: {
        id,
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
