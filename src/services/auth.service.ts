import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from '@/common/classes/dtos/change-password.dto';
import { CreateUserDTO } from '@/common/classes/schemas/create-user.dto';
import { LoginDTO } from '@/common/classes/schemas/login.dto';
import { UsersService } from '@/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private async createAccessToken(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    if (!process.env.JWT_SECRET) {
      throw new InternalServerErrorException('Configuração JWT_SECRET ausente');
    }

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }

  async signIn(data: LoginDTO) {
    const user = await this.usersService.getAuthUserByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user.isActive === false) {
      throw new UnauthorizedException(
        'Sua conta está inativa. Entre em contato com o suporte.',
      );
    }

    if (!user.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = await this.createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      status: HttpStatus.OK,
      message: 'Login realizado com sucesso',
      token,
    };
  }

  async signUp(data: CreateUserDTO) {
    const existingUser = await this.usersService.getAuthUserByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('O email inserido já está cadastrado');
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await this.usersService.createUser({
      ...data,
      password,
      role: data.role || 'STUDENT',
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Usuário criado com sucesso',
      user,
    };
  }

  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await this.usersService.getAuthUserById(userId);

    if (!user || !user.password) {
      throw new UnauthorizedException('Usuário não autenticado.');
    }

    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);
    await this.usersService.updatePasswordById(userId, newPasswordHash);

    return {
      message: 'Senha alterada com sucesso!',
    };
  }

  async logout() {
    return {
      status: HttpStatus.OK,
      message: 'Logout realizado com sucesso',
    };
  }
}
