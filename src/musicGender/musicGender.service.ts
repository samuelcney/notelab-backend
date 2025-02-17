import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async addMusicGender(data: MusicGenderDTO) {
    const genderToLowerCase = data.description.toLowerCase();

    const genderExist =
      await this.musicGenderRepository.findByDescription(genderToLowerCase);

    if (genderExist) {
      throw new ConflictException(
        `O Gênero Musical "${data.description}" já está cadastrado.`,
      );
    }
    return await this.musicGenderRepository.create({
      ...data,
      description: genderToLowerCase,
    });
  }

  async updateMusicGender(data: MusicGenderDTO, id: number) {
    const genderExist = await this.musicGenderRepository.findById(id);

    if (!genderExist) {
      throw new ConflictException(`O Gênero com o ID ${id} não foi encontrado`);
    }

    return await this.musicGenderRepository.update(genderExist.id, data);
  }

  async deleteMusicGender(id: number) {
    const gender = await this.musicGenderRepository.delete(id);

    if (!gender) {
      throw new NotFoundException(`Gênero com o ID ${id} não foi encontrado`);
    }

    return gender;
  }
}
