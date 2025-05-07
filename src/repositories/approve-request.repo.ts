import { Injectable } from '@nestjs/common';
import { CreateApproveRequestDTO } from 'src/common/classes/dtos/create-approve-request.dto';
import { PrismaService } from 'src/services/prisma.service';

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

  async findByUserId(userId: string) {
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

  async approveRequest(requestId: number, userId: string, status: boolean) {
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
