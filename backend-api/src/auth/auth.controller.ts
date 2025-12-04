import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; 
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login com email e senha' })
  @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}