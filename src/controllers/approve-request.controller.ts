import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateApproveRequestDTO } from 'src/common/classes/dtos/create-approve-request.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApproveRequestService } from '../services/approve-request.service';

@UseGuards(AuthGuard)
@Controller('/approve-requests')
export class ApproveRequestController {
  constructor(private readonly requestService: ApproveRequestService) {}

  @Get()
  getAllRequests() {
    return this.requestService.getAllRequests();
  }

  @Post()
  @UseInterceptors(FileInterceptor('documents'))
  createApproveRequest(
    @Body() dto: CreateApproveRequestDTO,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const userId = req.user.id;
      dto.userId = userId;
      if (!file) {
        throw new BadRequestException('Arquivo não enviado.');
      }

      return this.requestService.createApproveRequest(dto, file);
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Erro ao criar solicitação de aprovação.',
      );
    }
  }

  @Post('/approve/:id')
  approveRequest(
    @Param('id') requestId: number,
    @Body() data: { userId: string; comment?: string; status: boolean },
    @Req() req,
  ) {
    const user = req.user;

    if (user.app_metadata?.role !== 'admin') {
      throw new UnauthorizedException(
        'Apenas administradores podem aprovar solicitações.',
      );
    }

    if (!requestId) {
      throw new BadRequestException('ID da solicitação é obrigatório.');
    }

    if (!requestId) {
      throw new BadRequestException('ID da solicitação é obrigatório.');
    }

    return this.requestService.approveRequest(
      requestId,
      data.userId,
      data.status,
      data.comment,
    );
  }
}
