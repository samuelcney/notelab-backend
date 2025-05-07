import { ConflictException, Injectable } from '@nestjs/common';
import { CreateApproveRequestDTO } from 'src/common/classes/dtos/create-approve-request.dto';
import { ApproveRequestRepository } from '../repositories/approve-request.repo';

@Injectable()
export class ApproveRequestService {
  constructor(private readonly requestRepository: ApproveRequestRepository) {}

  async getAllRequests() {
    return await this.requestRepository.findAll();
  }

  async createApproveRequest(data: CreateApproveRequestDTO) {
    const existingRequest = await this.requestRepository.findByUserId(
      data.userId,
    );

    if (existingRequest) {
      throw new ConflictException('Você já possui uma solicitação pendente.');
    }

    return await this.requestRepository.createRequest(data);
  }
}
