import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from '../entities/ticket.entity';
import { TicketHistory } from '../entities/ticket-history.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketHistory]), AuthModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
