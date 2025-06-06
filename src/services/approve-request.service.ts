import { ConflictException, Injectable } from '@nestjs/common';
import { CreateApproveRequestDTO } from 'src/common/classes/dtos/create-approve-request.dto';
import { ApproveRequestRepository } from '../repositories/approve-request.repo';
import { SupabaseStorageService } from './supabase-s3.service';

@Injectable()
export class ApproveRequestService {
  constructor(
    private readonly requestRepository: ApproveRequestRepository,
    private readonly bucket: SupabaseStorageService,
  ) {}

  async getAllRequests() {
    return await this.requestRepository.findAll();
  }

  async createApproveRequest(
    data: CreateApproveRequestDTO,
    file: Express.Multer.File,
  ) {
    const existingRequest = await this.requestRepository.findByUserId(
      data.userId,
    );

    if (existingRequest) {
      throw new ConflictException('Você já possui uma solicitação pendente.');
    }

    if (file) {
      const ext = file.originalname.split('.').pop();
      const url = await this.bucket.uploadRequestDocument(
        data.userId,
        file.buffer,
        ext!,
      );
      data.documents = url;
    }

    return await this.requestRepository.createRequest(data);
  }

  async approveRequest(
    requestId: number,
    userId: string,
    status: boolean,
    comment?: string,
  ) {
    const request = await this.requestRepository.findById(requestId);
    if (!request) {
      throw new ConflictException('Solicitação não encontrada.');
    }

    return await this.requestRepository.approveRequest(
      requestId,
      userId,
      status,
    );
  }
}
