import { Controller, Body, Post, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredetialsDto, type CredetialsType } from './auth.dto';
import { SupabaseAuthGuard } from '../common/guards/auth.guard';
import { Token } from 'src/common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() credentials: CredetialsDto) {
    console.log(credentials);
    return this.authService.register(credentials);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() credetials: CredetialsType) {
    return this.authService.login(credetials);
  }
  @Post('signout')
  @UseGuards(SupabaseAuthGuard)
  @HttpCode(200)
  async signout(@Token() token: string) {
    return this.authService.signOut(token);
  }
}
