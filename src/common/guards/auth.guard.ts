import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { supabase } from 'src/database/supabase';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;

    if (!token) {
      throw new UnauthorizedException('Token ausente');
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      Logger.error('Usuário não autenticado', error);
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    request['user'] = data.user;
    request['lang'] = request.headers['accept-language'] ?? 'pt';

    Logger.log(`Request sent by user ${data.user.id}`, 'AUTH GUARD');
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
