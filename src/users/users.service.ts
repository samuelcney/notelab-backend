import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repo';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers() {
    const users = await this.usersRepository.findAll();

    return users.map(user =>
      plainToClass(UserResponseDTO, user, { excludeExtraneousValues: true }),
    );
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `O usuário com o email ${email} não encontrado`,
      );
    }

    return plainToClass(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`O usuário com o ID ${id} não encontrado`);
    }

    return plainToClass(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(data: CreateUserDTO) {
    try {
      const existingUser = await this.usersRepository.findByEmail(data.email);

      if (existingUser) {
        throw new ConflictException('O e-mail inserido já está cadastrado');
      }

      const hashPassword = bcrypt.hashSync(data.password, 10);

      const user = await this.usersRepository.create({
        email: data.email,
        name: data.name,
        password: hashPassword,
      });

      return plainToClass(UserResponseDTO, user, {
        excludeExtraneousValues: true,
      });
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

  async deleteUser(id: number) {
    return await this.usersRepository.delete(id);
  }
}
