import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateUserDTO } from 'src/common/classes/schemas/create-user.dto';
import { UpdateUserDTO } from 'src/common/classes/schemas/update-profile-info.dto';
import { PrismaService } from '../database/prisma.service';

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
    isActive: true,
  };

  async findAll() {
    return await this.prisma.user.findMany({
      select: this.userSelect,
      orderBy: {
        name: 'asc',
      },
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
        isActive: true,
      },
    });

    if (!user) return null;

    return user;
  }

  async findById(id: string) {
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
        userBio: {
          select: {
            bio: true,
            avatarUrl: true,
            phone: true,
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
        id: data.id,
        name: data.name,
        email: data.email,
        cart: { create: {} },
        userBio: { create: {} },
      },
    });

    return user;
  }

  async update(data: Partial<CreateUserDTO>) {
    const user = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
      select: this.userSelect,
    });

    return user;
  }

  async updateProfileInfo(userId: string, data: Partial<UpdateUserDTO>) {
    const { name, bio, avatarUrl, phone } = data;

    const bioData: any = {};
    if (bio !== undefined) bioData.bio = bio;
    if (avatarUrl !== undefined) bioData.avatarUrl = avatarUrl;
    if (phone !== undefined) bioData.phone = phone;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(Object.keys(bioData).length > 0 && {
          userBio: {
            upsert: {
              update: bioData,
              create: bioData,
            },
          },
        }),
      },
    });

    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...this.userSelect,
        userBio: {
          select: {
            bio: true,
            avatarUrl: true,
            phone: true,
          },
        },
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async updateUserRole(userId: string, newRole: Role) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  async updateUserStatus(userId: string, status: boolean) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: status },
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
