import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketHistory } from '../entities/ticket-history.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Message } from '../entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketsRepo: Repository<Ticket>,
    @InjectRepository(TicketHistory)
    private readonly historyRepo: Repository<TicketHistory>,
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
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

  async findAllForUser(user: { id: number; role: string }, page = 1, limit = 10) {
    const whereCondition = user.role === 'MANAGER' 
      ? {} 
      : { createdById: user.id };
    
    const [items, total] = await this.ticketsRepo.findAndCount({
      where: whereCondition,
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    // Transforme les éléments pour inclure le nom du propriétaire du ticket
    const transformedItems = items.map(item => ({
      ...item,
      creatorName: item.createdBy?.name || null,
      createdBy: undefined, // Supprime l'objet utilisateur complet
    }));
    
    return { items: transformedItems, total, page, limit };
  }

  async findOneAllowed(ticketId: number, userInfo: { id: number; role: string }) {
    const ticket = await this.ticketsRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (userInfo.role !== 'MANAGER' && ticket.createdById !== userInfo.id) {
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

  async history(id: number, user: { id: number; role: string }) {
    const allowed = await this.findOneAllowed(id, user);
    if (!allowed) throw new ForbiddenException('Forbidden');
    return this.historyRepo.find({ where: { ticket: { id } as any }, order: { changedAt: 'DESC' } });
  }

  async createMessage(ticketId: number, dto: CreateMessageDto, user: { id: number; role: string }) {
    const ticket = await this.ticketsRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.status === TicketStatus.CLOSED) {
      throw new ForbiddenException('Ticket is closed');
    }
    if (user.role !== 'MANAGER' && ticket.createdById !== user.id) {
      throw new ForbiddenException('Forbidden');
    }
    const msg = this.messagesRepo.create({
      ticketId: ticketId,
      authorId: user.id,
      content: dto.content,
    });
    return this.messagesRepo.save(msg);
  }

  async listMessages(ticketId: number, user: { id: number; role: string }) {
    const allowed = await this.findOneAllowed(ticketId, user);
    if (!allowed) throw new ForbiddenException('Forbidden');
    return this.messagesRepo.find({ where: { ticketId }, order: { createdAt: 'ASC' } });
  }
}
