import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto, req.user.userId);
  }

  @Get()
  async findAll(
    @Req() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.ticketsService.findAllForUser(req.user, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const result = await this.ticketsService.findOneAllowed(id, req.user);
    if (!result) {
      return { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden' };
    }
    return result;
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateStatus(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    if (req.user.role !== 'MANAGER') {
      return { statusCode: HttpStatus.FORBIDDEN, message: 'Only MANAGER can change status' };
    }
    return this.ticketsService.changeStatus(id, dto.status, req.user.userId);
  }

  @Get(':id/history')
  async history(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    const allowed = await this.ticketsService.findOneAllowed(id, req.user);
    if (!allowed) {
      return { statusCode: HttpStatus.FORBIDDEN, message: 'Forbidden' };
    }
    return this.ticketsService.history(id, req.user);
  }
}
