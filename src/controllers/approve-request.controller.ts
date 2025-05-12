import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
  createApproveRequest(@Body() data: CreateApproveRequestDTO) {
    return this.requestService.createApproveRequest(data);
  }
}
