import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async addInstrument(data: InstrumentDTO) {
    const instrumentToLowerCase = data.description.toLowerCase();

    const instrumentExist = await this.instrumentRepository.findByDescription(
      instrumentToLowerCase,
    );

    if (instrumentExist) {
      throw new ConflictException(
        `O instrumento "${data.description}" já está cadastrado.`,
      );
    }

    return await this.instrumentRepository.create({
      ...data,
      description: instrumentToLowerCase,
    });
  }

  async updateInstrument(data: InstrumentDTO, id: number) {
    const instrumentExist = await this.instrumentRepository.findById(id);

    if (!instrumentExist) {
      throw new ConflictException(
        `O Instrumento com o ID ${id} não foi encontrado`,
      );
    }

    return await this.instrumentRepository.update(instrumentExist.id, data);
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
