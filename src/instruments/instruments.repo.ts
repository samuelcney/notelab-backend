import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InstrumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.instrument.findMany();
  }

  async findById(id: number) {
    return await this.prisma.instrument.findUnique({
      where: {
        id,
      },
    });
  }

  async findByDescription(desc: string) {
    return await this.prisma.instrument.findFirst({
      where: {
        description: desc,
      },
    });
  }

  async create(data: InstrumentType) {
    return await this.prisma.instrument.create({
      data: {
        description: data.description,
      },
    });
  }

  async update(id: number, data: InstrumentType) {
    return await this.prisma.instrument.update({
      data: {
        description: data.description,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.instrument.delete({
      where: {
        id,
      },
    });
  }
}
