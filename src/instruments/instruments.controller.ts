import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InstrumentsService } from './instruments.service';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  getAllInstruments() {
    return this.instrumentsService.getAllInstruments();
  }

  @Get('/:id')
  getInstrumentsById(@Param('id') id: number) {
    return this.instrumentsService.getInstrumentById(Number(id));
  }

  @Post()
  addInstrument(@Body() data: InstrumentType) {
    return this.instrumentsService.addInstrument(data);
  }

  @Put('/:id')
  updateInstrument(@Body() data: InstrumentType, @Param('id') id: number) {
    return this.instrumentsService.updateInstrument(data, Number(id));
  }
  @Delete('/:id')
  deleteInstrument(@Param('id') id: number) {
    return this.instrumentsService.deleteInstrument(Number(id));
  }
}
