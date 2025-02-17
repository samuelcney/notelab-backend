import { Injectable, NotFoundException } from '@nestjs/common';
import { InstrumentsRepository } from './instruments.repo';

@Injectable()
export class InstrumentsService {
  constructor(private readonly instrumentRepository: InstrumentsRepository) {}

  async getAllInstruments() {
    return await this.instrumentRepository.findAll();
  }

  async getInstrumentById(id: number) {
    const instrument = await this.instrumentRepository.findById(id);

    if (!instrument) {
      throw new NotFoundException(
        `Instrumento com o ID ${id} não foi encontrado`,
      );
    }

    return instrument;
  }

  async addInstrument(description: string) {
    return await this.instrumentRepository.create(description);
  }

  async deleteInstrument(id: number) {
    const instrument = await this.instrumentRepository.delete(id);

    if (!instrument) {
      throw new NotFoundException(
        `Instrumento com o ID ${id} não foi encontrado`,
      );
    }

    return instrument;
  }
}
