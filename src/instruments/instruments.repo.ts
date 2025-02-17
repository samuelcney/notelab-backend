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

  async create(description: string) {
    return await this.prisma.instrument.create({
      data: {
        description,
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
