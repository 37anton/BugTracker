import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketHistory } from '../entities/ticket-history.entity';
import { User } from '../entities/user.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { AuthModule } from '../auth/auth.module';
import { Message } from '../entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketHistory, Message, User]), AuthModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
