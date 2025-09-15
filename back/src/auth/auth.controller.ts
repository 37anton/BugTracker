import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: any) {
    const authHeader: string | undefined = req.headers['authorization'];
    const token = (authHeader || '').replace('Bearer ', '').trim();
    if (token) {
      await this.authService.logout(token);
    }
    return;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    return req.user;
  }
}
