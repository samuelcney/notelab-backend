import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    const { password, ...userResponse } = user;
    return userResponse;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    const { password, ...userResponse } = user;
    return userResponse;
  }

  async create(data: CreateUserDTO) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    const { password, ...userResponse } = user;
    return userResponse;
  }

  async delete(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
