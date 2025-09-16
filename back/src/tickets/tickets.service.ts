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
      createdById: userId,
    });
    const savedTicket = await this.ticketsRepo.save(ticket);

    // Créer automatiquement un historique avec le statut OPEN
    const history = this.historyRepo.create({
      ticket: savedTicket,
      newStatus: TicketStatus.OPEN,
      changedById: userId,
    });
    await this.historyRepo.save(history);

    return savedTicket;
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
    
    // Récupérer le statut actuel pour chaque ticket
    const transformedItems = await Promise.all(items.map(async (item) => {
      const lastHistory = await this.historyRepo.findOne({
        where: { ticket: { id: item.id } as any },
        order: { changedAt: 'DESC' }
      });

      return {
        ...item,
        status: lastHistory?.newStatus || TicketStatus.OPEN,
        creatorName: item.createdBy?.name || null,
        createdBy: undefined, // Supprime l'objet utilisateur complet
      };
    }));
    
    return { items: transformedItems, total, page, limit };
  }

  async findOneAllowed(ticketId: number, userInfo: { id: number; role: string }) {
    const ticket = await this.ticketsRepo.findOne({ 
      where: { id: ticketId },
      relations: ['createdBy']
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (userInfo.role !== 'MANAGER' && ticket.createdById !== userInfo.id) {
      return null;
    }

    // Récupérer le dernier statut depuis l'historique
    const lastHistory = await this.historyRepo.findOne({
      where: { ticket: { id: ticketId } as any },
      order: { changedAt: 'DESC' }
    });

    return {
      ...ticket,
      status: lastHistory?.newStatus || TicketStatus.OPEN,
      creatorName: ticket.createdBy?.name || null,
      createdBy: undefined // Supprime l'objet utilisateur complet
    };
  }

  async changeStatus(id: number, newStatus: TicketStatus, changedById: number) {
    const ticket = await this.ticketsRepo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    const history = this.historyRepo.create({
      ticket: ticket as any,
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
    
    // Récupérer le dernier statut depuis l'historique
    const lastHistory = await this.historyRepo.findOne({
      where: { ticket: { id: ticketId } as any },
      order: { changedAt: 'DESC' }
    });
    
    if (lastHistory?.newStatus === TicketStatus.CLOSED) {
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
    return this.messagesRepo.find({ 
      where: { ticketId }, 
      relations: ['author'],
      order: { createdAt: 'ASC' } 
    });
  }
}
