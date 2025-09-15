import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UsersSeeder implements OnModuleInit {
  private readonly logger = new Logger(UsersSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepository.count();
    if (count === 0) {
      await this.usersService.createUser({
        email: 'admin@example.com',
        password: 'admin',
        name: 'Admin',
        role: UserRole.MANAGER,
      });
      this.logger.log('Seeded default admin user: admin@example.com / admin');
    }
  }
}
