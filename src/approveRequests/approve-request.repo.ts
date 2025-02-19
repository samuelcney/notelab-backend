import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApproveRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
  };

  async findAll() {
    return await this.prisma.approveInstructorRequest.findMany({
      include: {
        user: {
          select: this.userSelect,
        },
      },
    });
  }

  async findById(id: number) {
    return await this.prisma.approveInstructorRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: this.userSelect,
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return await this.prisma.approveInstructorRequest.findUnique({
      where: { userId: userId },
      include: {
        user: {
          select: this.userSelect,
        },
      },
    });
  }

  async createRequest(data: CreateApproveRequestDTO) {
    return await this.prisma.approveInstructorRequest.create({
      data: {
        userId: data.userId,
        certificate: data.certificate,
      },
    });
  }

  async approveRequest(requestId: number, userId: number, status: boolean) {
    await this.prisma.$transaction([
      this.prisma.approveInstructorRequest.update({
        where: { id: requestId },
        data: {
          status: status ? 'APPROVED' : 'REJECTED',
          approvedAt: status ? new Date() : null,
          rejectedAt: !status ? new Date() : null,
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          role: status ? 'INSTRUCTOR' : 'STUDENT',
          isApprovedAccount: status,
        },
      }),
    ]);
  }
}
