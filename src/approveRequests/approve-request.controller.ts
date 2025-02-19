import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApproveRequestService } from './approve-request.service';

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
