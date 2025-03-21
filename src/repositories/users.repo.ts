import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDTO } from 'src/common/dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    isActiveUser: true,
    isApprovedAccount: true,
  };

  async findAll() {
    return await this.prisma.user.findMany({
      select: this.userSelect,
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) return null;

    return user;
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...this.userSelect,
        cart: {
          include: {
            cartItems: true,
          },
        },
      },
    });

    if (!user) return null;

    return user;
  }

  async create(data: CreateUserDTO) {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        cart: { create: {} },
      },
    });

    const { password, ...userResponse } = user;
    return userResponse;
  }

  async update(id: number, data: Partial<CreateUserDTO>) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
      select: this.userSelect,
    });

    return user;
  }

  async delete(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
