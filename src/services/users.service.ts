import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '@prisma/client';
import { supabaseAdmin } from 'src/database/supabase';
import { UsersRepository } from 'src/repositories/users.repo';
import { formatDate } from 'src/utils/dateFormatter';
import { CreateUserDTO } from '../common/classes/schemas/create-user.dto';

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
      Logger.error('Erro ao criar usuário:', error);
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

  async updateRole(userId: string, newRole: Role) {
    const { error: claimsError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        app_metadata: {
          role: newRole,
        },
      });

    if (claimsError) {
      Logger.error('Erro ao atualizar role no Supabase:', claimsError);
      throw new InternalServerErrorException(
        'Erro ao atualizar role no Supabase',
      );
    }

    await this.usersRepository.updateUserRole(userId, newRole);

    return { message: 'Role atualizada com sucesso' };
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
