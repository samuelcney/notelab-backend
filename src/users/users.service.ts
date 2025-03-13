import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repo';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { formatDate } from 'src/utils/dateFormatter';

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

  async getUserById(id: number) {
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

      const hashPassword = bcrypt.hashSync(data.password, 10);

      const user = await this.usersRepository.create({
        ...data,
        password: hashPassword,
      });

      return {
        ...user,
        createdAt: formatDate(user.createdAt),
        updatedAt: formatDate(user.updatedAt),
      };
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro inesperado ao criar usuário',
      );
    }
  }

  async updateUser(id: number, data: CreateUserDTO) {
    const userExist = this.usersRepository.findById(id);

    if (!userExist) {
      throw new NotFoundException(
        `O usuário com o ID ${id} não foi encontrado`,
      );
    }

    return await this.usersRepository.update(id, data);
  }

  async deleteUser(id: number) {
    const userExist = this.usersRepository.findById(id);

    if (!userExist) {
      throw new NotFoundException(
        `O usuário com o ID ${id} não foi encontrado`,
      );
    }

    return await this.usersRepository.delete(id);
  }
}
