import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketHistory } from '../entities/ticket-history.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TicketStatus } from '../enums/ticket-status.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepo: Repository<Ticket>,
    @InjectRepository(TicketHistory)
    private readonly historyRepo: Repository<TicketHistory>,
  ) {}

  async create(dto: CreateTicketDto, userId: number) {
    const ticket = this.ticketsRepo.create({
      title: dto.title,
      description: dto.description,
      status: TicketStatus.OPEN,
      createdById: userId,
    });
    return this.ticketsRepo.save(ticket);
  }

  async findAllForUser(user: { userId: number; role: string }, page = 1, limit = 10) {
    const qb = this.ticketsRepo.createQueryBuilder('t');
    if (user.role !== 'MANAGER') {
      qb.where('t.createdById = :userId', { userId: user.userId });
    }
    qb.orderBy('t.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOneAllowed(id: number, user: { userId: number; role: string }) {
    const ticket = await this.ticketsRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (user.role !== 'MANAGER' && ticket.createdById !== user.userId) {
      return null;
    }
    return ticket;
  }

  async changeStatus(id: number, newStatus: TicketStatus, changedById: number) {
    const ticket = await this.ticketsRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    const previousStatus = ticket.status;
    ticket.status = newStatus;
    await this.ticketsRepo.save(ticket);

    const history = this.historyRepo.create({
      ticket: ticket as any,
      previousStatus,
      newStatus,
      changedById,
    });
    await this.historyRepo.save(history);
    return ticket;
  }

  async history(id: number, user: { userId: number; role: string }) {
    const allowed = await this.findOneAllowed(id, user);
    if (!allowed) return [];
    return this.historyRepo.find({ where: { ticket: { id } as any }, order: { changedAt: 'DESC' } });
  }
}
