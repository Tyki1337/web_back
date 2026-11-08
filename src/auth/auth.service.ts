import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { CredetialsType } from './auth.dto';
import { supabase } from 'src/lib/supabase';

@Injectable()
export class AuthService {
  async login(credetials: CredetialsType) {
    const { data, error } = await supabase.auth.signInWithPassword({
      ...credetials,
    });
    if (error)
      throw new UnauthorizedException(error.message, 'Логин и пароль неверный');
    return data;
  }
  async register(credetials: CredetialsType) {
    const { data, error } = await supabase.auth.signUp(credetials);
    if (error)
      throw new BadRequestException(error.message, 'Ошибка при регистрации');
    return data;
  }
  async signOut(token: string) {
    const { error } = await supabase.auth.admin.signOut(token);
    if (error) throw new BadRequestException(error.message);
    return { message: 'Выход успешен' };
  }
}
