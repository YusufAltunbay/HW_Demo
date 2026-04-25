import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: any) {
    if (body.username === 'admin' && body.password === '1234') {
      return { token: 'fake-jwt-token-12345' };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
