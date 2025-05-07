import { Injectable } from '@nestjs/common';
import { CategoryDTO } from 'src/common/classes/dtos/create-category.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findById(id: number) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async findByDescription(desc: string) {
    return await this.prisma.category.findFirst({
      where: {
        name: desc,
      },
    });
  }

  async create(data: CategoryDTO) {
    return await this.prisma.category.create({
      data: {
        name: data.name,
      },
    });
  }

  async update(id: number, data: CategoryDTO) {
    return await this.prisma.category.update({
      data: {
        name: data.name,
      },
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
