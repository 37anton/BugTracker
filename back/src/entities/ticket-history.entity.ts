import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

@Entity('ticket_history')
export class TicketHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TicketStatus,
  })
  newStatus: TicketStatus;


  @CreateDateColumn()
  changedAt: Date;

  @ManyToOne(() => Ticket, (ticket) => ticket.history)
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'changedById' })
  changedBy: User;

  @Column()
  changedById: number;
}
