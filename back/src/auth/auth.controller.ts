import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() body: RegisterDto) {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) {
      return { statusCode: HttpStatus.CONFLICT, message: 'Email déjà utilisé' };
    }
    const user = await this.usersService.createUser({
      email: body.email,
      password: body.password,
      name: body.name,
      role: UserRole.CLIENT,
    });
    const token = await this.authService.login(user);
    return token;
  }

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
