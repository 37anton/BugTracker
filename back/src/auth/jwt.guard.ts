import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers['authorization'];
    const token = (authHeader || '').replace('Bearer ', '').trim();
    if (token && this.authService.isBlacklisted(token)) {
      return false;
    }
    return super.canActivate(context) as any;
  }
}
