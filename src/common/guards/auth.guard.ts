import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { supabase } from 'src/lib/supabase';
import { Request } from 'express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Отсутствует или неверный формат токена авторизации',
      );
    }

    const token = authHeader.split(' ')[1];
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException(
        'Недействительный или просроченный токен сессии',
      );
    }

    request.user = user;
    request.token = token;

    return true;
  }
}
