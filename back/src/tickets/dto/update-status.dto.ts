import { IsEnum } from 'class-validator';
import { TicketStatus } from '../../enums/ticket-status.enum';

export class UpdateStatusDto {
  @IsEnum(TicketStatus)
  status: TicketStatus;
}
