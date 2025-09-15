import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TicketStatus } from '../enums/ticket-status.enum';
import { User } from './user.entity';
import { TicketHistory } from './ticket-history.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.createdTickets)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: number;


  @OneToMany(() => TicketHistory, (history) => history.ticket)
  history: TicketHistory[];
}
