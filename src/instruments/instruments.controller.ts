import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
    return this.instrumentsService.getInstrumentById(id);
  }

  @Post()
  addInstrument(@Body() description: string) {
    return this.instrumentsService.addInstrument(description);
  }

  @Delete('/:id')
  deleteInstrument(@Param('id') id: number) {
    return this.instrumentsService.deleteInstrument(id);
  }
}
