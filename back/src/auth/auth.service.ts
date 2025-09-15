import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

const blacklistedTokens = new Set<string>();

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await this.usersService.validatePassword(pass, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: User): Promise<{ accessToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  async logout(token: string): Promise<void> {
    blacklistedTokens.add(token);
  }

  isBlacklisted(token: string): boolean {
    return blacklistedTokens.has(token);
  }
}
