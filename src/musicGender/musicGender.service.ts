import { Injectable, NotFoundException } from '@nestjs/common';
import { MusicGenderRepository } from './musicGender.repo';

@Injectable()
export class MusicGenderService {
  constructor(private readonly musicGenderRepository: MusicGenderRepository) {}

  async getAllMusicGenders() {
    return await this.musicGenderRepository.findAll();
  }

  async getMusicGenderById(id: number) {
    const gender = await this.musicGenderRepository.findById(id);

    if (!gender) {
      throw new NotFoundException(`Gênero com o ID ${id} não foi encontrado`);
    }

    return gender;
  }

  async addMusicGender(description: string) {
    return await this.musicGenderRepository.create(description);
  }

  async deleteMusicGender(id: number) {
    const gender = await this.musicGenderRepository.delete(id);

    if (!gender) {
      throw new NotFoundException(`Gênero com o ID ${id} não foi encontrado`);
    }

    return gender;
  }
}
