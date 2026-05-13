import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '@prisma/client';
import { UpdateUserDTO } from '@/common/classes/schemas/update-profile-info.dto';
import { UsersRepository } from '@/repositories/users.repo';
import { formatDate } from '@/utils/dateFormatter';
import { CreateUserDTO } from '../common/classes/schemas/create-user.dto';
import { SupabaseStorageService } from './supabase-s3.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly supabaseStorage: SupabaseStorageService,
  ) {}

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
  }

  async getAuthUserByEmail(email: string) {
    return await this.usersRepository.findAuthByEmail(email);
  }

  async getAuthUserById(id: string) {
    return await this.usersRepository.findAuthById(id);
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

  async updateUserProfile(
    userId: string,
    data: Partial<UpdateUserDTO>,
    file?: Express.Multer.File,
  ) {
    const userExist = await this.usersRepository.findById(userId);

    if (!userExist) {
      throw new NotFoundException(
        `O usuário com o ID ${userId} não foi encontrado`,
      );
    }

    if (file) {
      const ext = file.originalname.split('.').pop();
      const avatarUrl = await this.supabaseStorage.uploadAvatar(
        userId,
        file.buffer,
        ext!,
      );
      data.avatarUrl = avatarUrl;
    }

    return this.usersRepository.updateProfileInfo(userExist.id, data);
  }

  async updateRole(userId: string, newRole: Role) {
    await this.usersRepository.updateUserRole(userId, newRole);

    return { message: 'Role atualizada com sucesso' };
  }

  async updatePasswordById(userId: string, password: string) {
    return await this.usersRepository.updatePassword(userId, password);
  }

  async updatePasswordByEmail(email: string, password: string) {
    const user = await this.usersRepository.findAuthByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `O usuário com o email ${email} não foi encontrado`,
      );
    }

    return await this.usersRepository.updatePassword(user.id, password);
  }

  async updateUserStatus(userId: string, status: boolean) {
    const userExist = await this.usersRepository.findById(userId);

    if (!userExist) {
      throw new NotFoundException(
        `O usuário com o ID ${userId} não foi encontrado`,
      );
    }

    return this.usersRepository.updateUserStatus(userId, status);
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
