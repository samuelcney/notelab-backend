import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PasswordRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.passwordRequest.findMany();
  }

  async findByEmail(email: string) {
    return await this.prisma.passwordRequest.findFirst({
      where: {
        email,
      },
    });
  }

  async create(email: string, token: string) {
    const request = await this.prisma.passwordRequest.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 600),
      },
    });
    return request;
  }
}
