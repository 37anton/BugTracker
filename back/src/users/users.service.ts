import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(params: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<User> {
    const passwordHash = await this.hashPassword(params.password);
    const user = this.usersRepository.create({
      email: params.email,
      password: passwordHash,
      name: params.name,
      role: params.role as any,
    });
    return this.usersRepository.save(user);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
