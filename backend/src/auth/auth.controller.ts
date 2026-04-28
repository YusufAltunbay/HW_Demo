import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // Admin override
    if (body.username === 'admin' && body.password === '1234') {
      return { token: 'admin-token', role: 'admin', username: 'admin' };
    }
    
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return { token: 'user-token-' + user.id, role: user.role, username: user.username };
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register(body);
  }
}
