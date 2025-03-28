import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDTO } from '../common/classes/dtos/create-user.dto';
import { formatDate } from 'src/utils/dateFormatter';
import { UsersRepository } from 'src/repositories/users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers() {
    const users = await this.usersRepository.findAll();

    return users.map(user => ({
      ...user,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
    }));
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `O usuário com o email ${email} não foi encontrado`,
      );
    }

    return {
      ...user,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
    };
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(
        `O usuário com o ID ${id} não foi encontrado`,
      );
    }

    return {
      ...user,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
    };
  }

  async createUser(data: CreateUserDTO) {
    try {
      const existingUser = await this.usersRepository.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('O e-mail inserido já está cadastrado');
      }

      const user = await this.usersRepository.create({ ...data, id: data.id });

      return {
        ...user,
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
      };
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new InternalServerErrorException(
        'Erro inesperado ao criar usuário',
      );
    }
  }

  async updateUser(data: Partial<CreateUserDTO>) {
    const userExist = await this.usersRepository.findById(data.id ?? '');

    if (!userExist) {
      throw new NotFoundException(
        `O usuário com o ID ${data.id} não foi encontrado`,
      );
    }

    return this.usersRepository.update(data);
  }

  async deleteUser(id: string) {
    const userExist = await this.usersRepository.findById(id);

    if (!userExist) {
      throw new NotFoundException(
        `O usuário com o ID ${id} não foi encontrado`,
      );
    }

    return this.usersRepository.delete(id);
  }
}
